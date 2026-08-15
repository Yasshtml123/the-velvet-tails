import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartItems, selectCartSubtotal, clearCart } from '@/features/cartSlice.js';
import { formatPrice } from '@/utils/formatters.js';
import { Truck, CheckCircle } from 'lucide-react';

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

    // Calculate shipping cost
    const shippingCost = calculateShippingCost(subtotal);
    const estimatedTotal = subtotal + (shippingCost * 100); // Convert shipping to paise

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        pincode: '',
    });
    
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        setIsProcessing(true);
        
        // Simulate API call processing
        setTimeout(() => {
            dispatch(clearCart());
            setOrderPlaced(true);
            setIsProcessing(false);
        }, 1200);
    };

    // Success Screen
    if (orderPlaced) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-24 text-center min-h-[70vh] flex flex-col justify-center items-center">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 border border-green-100 shadow-sm animate-fade-in-slide-up">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h1 className="text-4xl font-bold font-serif text-charcoal mb-4 animate-fade-in-slide-up" style={{ animationDelay: '100ms' }}>
                    Order Confirmed!
                </h1>
                <p className="text-charcoal/70 font-sans text-lg mb-8 max-w-lg mx-auto leading-relaxed animate-fade-in-slide-up" style={{ animationDelay: '200ms' }}>
                    Thank you for shopping with The Velvet Tails. Your order has been received and will be shipped shortly. 
                    <br/><br/>
                    <span className="font-semibold text-charcoal">Payment Method:</span> Cash on Delivery
                </p>
                <button
                    onClick={() => navigate('/products')}
                    className="px-8 py-4 bg-plum hover:bg-plum/90 text-white font-sans font-bold text-base rounded-xl transition-all shadow-md hover:shadow-lg animate-fade-in-slide-up"
                    style={{ animationDelay: '300ms' }}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    // Empty Cart State
    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
                    <h1 className="text-3xl font-bold font-serif text-charcoal mb-4">Your Cart is Empty</h1>
                    <p className="text-charcoal/60 font-sans mb-8 text-lg">Add some premium pet products before checking out!</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-8 py-4 bg-plum hover:bg-plum/90 text-white font-sans font-bold rounded-xl transition-colors shadow-sm"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 bg-white min-h-screen">
            <h1 className="text-3xl lg:text-4xl font-bold font-serif text-charcoal mb-8">Secure Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                {/* Checkout Form */}
                <div className="lg:col-span-7">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* 1. Delivery Details */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 shadow-sm relative overflow-hidden">
                            {/* Decorative accent */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-plum"></div>
                            
                            <h2 className="text-xl font-bold font-serif text-charcoal mb-6 flex items-center gap-3">
                                <Truck className="w-5 h-5 text-plum" />
                                Delivery Details
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-2">
                                    <label htmlFor="name" className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wider mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Sarah Jenkins"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-charcoal font-sans text-sm focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum transition-colors"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="phone" className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wider mb-2">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Mobile number for delivery updates"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-charcoal font-sans text-sm focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum transition-colors"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="street" className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wider mb-2">
                                        Street Name / Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="street"
                                        name="street"
                                        required
                                        value={formData.street}
                                        onChange={handleChange}
                                        placeholder="House number and street name"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-charcoal font-sans text-sm focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="city" className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wider mb-2">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-charcoal font-sans text-sm focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="pincode" className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wider mb-2">
                                        Postal Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="pincode"
                                        name="pincode"
                                        required
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-charcoal font-sans text-sm focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Payment Method */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 shadow-sm">
                            <h2 className="text-xl font-bold font-serif text-charcoal mb-6">Payment Method</h2>
                            
                            <label className="flex items-center p-4 border-2 border-plum bg-plum/5 rounded-xl cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    value="cod" 
                                    checked 
                                    readOnly 
                                    className="w-5 h-5 text-plum border-gray-300 focus:ring-plum" 
                                />
                                <div className="ml-4 flex flex-col">
                                    <span className="font-bold text-charcoal font-sans">Cash on Delivery (Pay in Cash)</span>
                                    <span className="text-sm text-charcoal/60">Pay with cash upon delivery.</span>
                                </div>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full h-14 bg-plum hover:bg-plum/90 text-white font-sans font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isProcessing ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                'Place Order'
                            )}
                        </button>
                        <p className="text-center text-xs text-charcoal/50 font-sans mt-4">
                            By placing your order, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </form>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-5">
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 lg:p-8 sticky top-8">
                        <h2 className="text-xl font-bold font-serif text-charcoal mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            {cartItems.map((item) => (
                                <div key={item.product._id} className="flex gap-4">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-white">
                                        <img 
                                            src={item.product.images?.[0]?.url || item.product.images?.[0] || '/placeholder.png'} 
                                            alt={item.product.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h4 className="text-sm font-bold text-charcoal truncate">{item.product.title}</h4>
                                        <p className="text-xs text-charcoal/60 mt-1">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-sm font-bold text-charcoal flex flex-col justify-center items-end">
                                        {formatPrice(item.product.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-4 space-y-3 font-sans">
                            <div className="flex justify-between text-sm">
                                <span className="text-charcoal/70 font-medium">Subtotal</span>
                                <span className="text-charcoal font-semibold">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-charcoal/70 font-medium">Shipping</span>
                                <span className={shippingCost === 0 ? 'text-green-600 font-bold tracking-wide uppercase text-xs mt-0.5' : 'text-charcoal font-semibold'}>
                                    {shippingCost === 0 ? 'Free' : formatPrice(shippingCost * 100)}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-5 mt-5">
                            <div className="flex justify-between items-end">
                                <span className="text-lg font-bold font-serif text-charcoal">Total</span>
                                <span className="text-2xl font-bold font-sans text-plum">
                                    {formatPrice(estimatedTotal)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
