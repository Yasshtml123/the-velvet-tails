import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder, clearError } from '@/features/ordersSlice.js';
import { selectCartItems, selectCartSubtotal, clearCart } from '@/features/cartSlice.js';

// Calculate shipping cost based on cart subtotal (in paise)
const calculateShippingCost = (subtotalPaise) => {
    const subtotalRupees = subtotalPaise / 100;
    if (subtotalRupees >= 500) {
        return 0; // Free shipping
    } else if (subtotalRupees >= 200) {
        return 30; // ₹30 shipping
    } else {
        return 50; // ₹50 shipping
    }
};

export default function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector(selectCartItems);
    const subtotal = useSelector(selectCartSubtotal);
    const { isLoading, error } = useSelector((state) => state.orders);

    // Calculate shipping cost
    const shippingCost = calculateShippingCost(subtotal);
    const estimatedTotal = subtotal + (shippingCost * 100); // Convert shipping to paise

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        discountCode: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const orderData = {
            items: cartItems.map(item => ({
                productId: item.product._id,
                quantity: item.quantity
            })),
            shippingAddress: {
                name: formData.name,
                phone: formData.phone,
                street: formData.street,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode
            },
            discountCode: formData.discountCode || undefined,
            shippingCost: shippingCost // Use calculated shipping cost
        };

        try {
            const result = await dispatch(createOrder(orderData)).unwrap();
            dispatch(clearCart());
            navigate(`/payment/${result.order._id}`);
        } catch (err) {
            console.error('Failed to create order:', err);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-600 mb-8">Add some products before checking out!</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-3 bg-velvet-purple text-white rounded-md hover:bg-velvet-purple-dark"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex justify-between items-center">
                    <span className="text-red-800">{error}</span>
                    <button onClick={() => dispatch(clearError())} className="text-red-600 hover:text-red-800">
                        ✕
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-velvet-purple focus:border-blue-500"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        pattern="[6-9][0-9]{9}"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="10-digit mobile number"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-velvet-purple focus:border-blue-500"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                                        Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        id="street"
                                        name="street"
                                        required
                                        value={formData.street}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-velvet-purple focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-velvet-purple focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        required
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-velvet-purple focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                                        Pincode *
                                    </label>
                                    <input
                                        type="text"
                                        id="pincode"
                                        name="pincode"
                                        required
                                        pattern="[0-9]{6}"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        placeholder="6-digit pincode"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-velvet-purple focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Discount Code</h2>
                            <input
                                type="text"
                                id="discountCode"
                                name="discountCode"
                                value={formData.discountCode}
                                onChange={handleChange}
                                placeholder="Enter discount code (optional)"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-velvet-purple focus:border-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-6 py-3 bg-velvet-purple text-white rounded-md hover:bg-velvet-purple-dark focus:outline-none focus:ring-2 focus:ring-velvet-purple focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white shadow-md rounded-lg p-6 sticky top-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            {cartItems.map((item) => (
                                <div key={item.product._id} className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        {item.product.title} × {item.quantity}
                                    </span>
                                    <span className="text-gray-900">
                                        ₹{((item.product.price * item.quantity) / 100).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="text-gray-900">₹{(subtotal / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className={shippingCost === 0 ? 'text-green-600 font-medium' : 'text-gray-900'}>
                                    {shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}
                                </span>
                            </div>
                            {shippingCost > 0 && (subtotal / 100) < 500 && (
                                <div className="text-xs text-green-600">
                                    Add ₹{(500 - subtotal / 100).toFixed(2)} more for free shipping!
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax</span>
                                <span className="text-gray-900">Calculated on server</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <div className="flex justify-between">
                                <span className="text-base font-semibold text-gray-900">Estimated Total</span>
                                <span className="text-base font-semibold text-gray-900">₹{(estimatedTotal / 100).toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Final amount will be calculated with tax and discounts</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
