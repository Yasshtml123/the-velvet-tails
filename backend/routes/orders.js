import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { restoreInventory } from '../utils/inventory.js';
import { sendOrderCancellationEmail } from '../services/emailService.js';
import { generateInvoicePDF, generateInvoiceNumber } from '../services/invoiceService.js';
import Discount from '../models/Discount.js';
import TaxConfig from '../models/TaxConfig.js';
import { authenticate } from '../middleware/auth.js';
import mongoose from 'mongoose';

const router = express.Router();

// Note: authenticate is applied per-route below (not router-level)
// because PayU payment callbacks also hit this router without auth headers.

router.post('/', authenticate, async (req, res) => {
  try {
    const { items, shippingAddress, discountCode, shippingCost = 0 } = req.body;
    const shippingCostPaise = Math.round(shippingCost * 100);

    // --- Basic Input Validations ---
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    if (!shippingAddress || !shippingAddress.name?.trim() || !shippingAddress.phone?.trim() || 
        !shippingAddress.street?.trim() || !shippingAddress.city?.trim() || 
        !shippingAddress.state?.trim() || !shippingAddress.pincode?.trim()) {
      return res.status(400).json({ error: 'All shipping address fields are required' });
    }

    // --- Step 1: Batch Fetch All Requested Products in 1 Database Query ---
    const productIds = [];
    const itemMap = new Map();

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.productId || !item.quantity || item.quantity < 1) {
        return res.status(400).json({ error: `Item ${i + 1}: Valid Product ID and quantity required` });
      }
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({ error: `Item ${i + 1}: Invalid product ID format` });
      }
      productIds.push(item.productId);
      itemMap.set(item.productId.toString(), item.quantity);
    }

    // Single query for all products
    const fetchedProducts = await Product.find({ _id: { $in: productIds } }).lean();

    if (fetchedProducts.length !== productIds.length) {
      return res.status(404).json({ error: 'One or more products were not found' });
    }

    // Process products, calculate subtotal, and verify stock in memory
    const orderItems = [];
    let subtotal = 0;

    for (const product of fetchedProducts) {
      const requestedQty = itemMap.get(product._id.toString());

      if (product.inventory < requestedQty) {
        return res.status(400).json({
          error: `Insufficient stock for '${product.title}'. Only ${product.inventory} available.`
        });
      }

      const itemTotal = product.price * requestedQty;
      subtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        qty: requestedQty,
        dimensions: product.dimensions || { length: 10, breadth: 10, height: 10, weight: 0.5 }
      });
    }

    // --- Step 2: Fetch Tax Configuration & Discount concurrently ---
    const [taxConfig, discountDoc] = await Promise.all([
      TaxConfig.findOne({ isActive: true }).lean(),
      discountCode ? Discount.findOne({ code: discountCode.toUpperCase() }) : null
    ]);

    // Apply Discount Logic
    let discount = 0;
    if (discountCode) {
      if (!discountDoc || !discountDoc.active) {
        return res.status(400).json({ error: 'Invalid or inactive discount code' });
      }
      const now = new Date();
      if ((discountDoc.startsAt && now < discountDoc.startsAt) || (discountDoc.endsAt && now > discountDoc.endsAt)) {
        return res.status(400).json({ error: 'Discount code is not active' });
      }
      if (!discountDoc.canBeUsed()) {
        return res.status(400).json({ error: 'Discount usage limit reached' });
      }
      if (discountDoc.minOrderValue && subtotal < discountDoc.minOrderValue) {
        return res.status(400).json({ error: 'Minimum order value not met for discount' });
      }

      discount = discountDoc.calculateDiscount(subtotal);

      // Async increment discount usage
      await Discount.findByIdAndUpdate(discountDoc._id, {
        $inc: { usedCount: 1 },
        $addToSet: { usedBy: req.user._id }
      });
    }

    // Step 3: Tax & Total Calculations
    const subtotalAfterDiscount = subtotal - discount;
    const tax = taxConfig ? Math.round((subtotalAfterDiscount * taxConfig.rate) / 100) : 0;
    const amount = subtotalAfterDiscount + tax + shippingCostPaise;

    if (amount <= 0) {
      return res.status(400).json({ error: 'Order total must be greater than 0' });
    }

    // --- Step 4: Batch Inventory Updates in 1 BulkWrite Operations ---
    const bulkInventoryOps = orderItems.map(item => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { inventory: -item.qty } }
      }
    }));

    await Product.bulkWrite(bulkInventoryOps);

    // --- Step 5: Create Order Document ---
    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      subtotal,
      discount,
      tax,
      shippingCost: shippingCostPaise,
      amount,
      shippingAddress: {
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: shippingAddress.country || 'India'
      },
      payment: {
        method: 'payu',
        status: 'pending'
      },
      status: 'pending'
    });

    res.status(201).json({
      order,
      breakdown: {
        subtotal,
        subtotalRupees: (subtotal / 100).toFixed(2),
        discount,
        tax,
        shippingCostPaise,
        total: amount,
        totalRupees: (amount / 100).toFixed(2)
      }
    });

  } catch (err) {
    console.error('Create order error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: `Validation failed: ${messages.join(', ')}` });
    }
    res.status(500).json({ error: 'Failed to create order. Please try again.' });
  }
});

// --- GET /api/orders/my-orders --- (explicit alias for frontend)
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v -payment.rawResponse')
      .lean();

    res.json({ count: orders.length, orders });
  } catch (err) {
    console.error('Get my orders error:', err);
    res.status(500).json({ error: 'Failed to fetch your orders. Please try again.' });
  }
});

// --- GET /api/orders --- (requires authentication)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status } = req.query;
    const query = { userId: req.user._id };

    if (status) {
      const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid order status filter' });
      }
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .select('-__v -payment.rawResponse')
      .lean();

    res.json({ count: orders.length, orders });
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// --- GET /api/orders/:id/track ---
router.get('/:id/track', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (req.user && order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied. You can only track your own orders.' });
    }

    res.json({ status: order.status, order });
  } catch (err) {
    console.error('Track order error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }
    res.status(500).json({ error: 'Failed to track order. Please try again.' });
  }
});

// --- POST /api/orders/:id/cancel ---
router.post('/:id/cancel', async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (req.user && order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied. You can only cancel your own orders.' });
    }

    if (order.logistics?.awb) {
      return res.status(400).json({ error: 'Order has already been shipped and cannot be cancelled' });
    }

    if (!order.canBeCancelled()) {
      return res.status(400).json({
        error: 'Order cannot be cancelled',
        message: `Orders can only be cancelled when status is 'pending' or 'confirmed'. Current status: ${order.status}`
      });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason || 'Cancelled by customer';
    order.cancelledBy = 'user';

    const needsRefund = order.payment.status === 'paid';
    if (needsRefund && order.cancelledBy !== 'system') {
      order.refundRequested = true;
      order.refundRequestedAt = new Date();
      order.refundReason = reason || 'User cancelled paid order';
      order.refundStatus = 'requested';
    }

    // Restore Inventory with Bulk Write
    if (!order.inventoryRestored) {
      const bulkOps = order.items.map(item => ({
        updateOne: {
          filter: { _id: item.productId },
          update: { $inc: { inventory: item.qty } }
        }
      }));
      await Product.bulkWrite(bulkOps);
      order.inventoryRestored = true;
    }

    await order.save();

    // Async Email Notification
    if (req.user) {
      sendOrderCancellationEmail(order, req.user).catch(err =>
        console.error('Email sending failed (non-critical):', err)
      );
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order,
      needsRefund,
      refundMessage: needsRefund ? 'Refund will be processed within 5-7 business days' : null
    });

  } catch (err) {
    console.error('Cancel order error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }
    res.status(500).json({ error: 'Failed to cancel order. Please try again.' });
  }
});

// --- POST /api/orders/:id/return ---
router.post('/:id/return', async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: 'Return reason is required' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (req.user && order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied. You can only request returns for your own orders.' });
    }

    if (!order.canRequestReturn()) {
      if (order.status !== 'delivered') {
        return res.status(400).json({ error: 'Returns can only be requested for delivered orders' });
      }
      if (order.returnRequest?.requested) {
        return res.status(400).json({ error: 'A return request has already been submitted for this order' });
      }
      const deliveredAt = order.logistics?.deliveredAt;
      if (deliveredAt) {
        const daysSinceDelivery = Math.floor((Date.now() - new Date(deliveredAt)) / (1000 * 60 * 60 * 24));
        if (daysSinceDelivery > 15) {
          return res.status(400).json({ error: 'Return window has expired. Returns must be requested within 15 days of delivery.' });
        }
      }
      return res.status(400).json({ error: 'This order is not eligible for return' });
    }

    order.returnRequest = {
      requested: true,
      requestedAt: new Date(),
      reason: reason.trim(),
      status: 'requested'
    };

    await order.save();

    res.json({
      success: true,
      message: 'Return request submitted successfully. Our team will review and process your request.',
      order
    });

  } catch (err) {
    console.error('Return request error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }
    res.status(500).json({ error: 'Failed to submit return request. Please try again.' });
  }
});

// --- GET /api/orders/:id/invoice ---
router.get('/:id/invoice', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (req.user && order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied. You can only download invoices for your own orders.' });
    }

    if (order.payment.status !== 'paid') {
      return res.status(400).json({ error: 'Invoice is only available for paid orders' });
    }

    if (!order.invoiceNumber) {
      order.invoiceNumber = await generateInvoiceNumber(Order);
      order.invoiceGeneratedAt = new Date();
      await order.save();
    }

    const taxConfig = await TaxConfig.findOne({ isActive: true }).lean();
    const pdfBuffer = await generateInvoicePDF(order, taxConfig);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice-${order.invoiceNumber}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (err) {
    console.error('Invoice download error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }
    res.status(500).json({ error: 'Failed to generate invoice. Please try again.' });
  }
});

export default router;