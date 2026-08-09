import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, selectCartItems, selectCartSubtotal } from '@/features/cartSlice.js';

export default function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector(selectCartItems);
    const subtotal = useSelector(selectCartSubtotal);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) {
            dispatch(removeFromCart(productId));
        } else {
            dispatch(updateQuantity({ productId, quantity: newQuantity }));
        }
    };

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/checkout');
        } else {
            navigate('/checkout');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-600 mb-8">Add some products to get started!</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-3 bg-velvet-purple text-white rounded-md hover:bg-velvet-purple-dark focus:outline-none focus:ring-2 focus:ring-velvet-purple focus:ring-offset-2"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        {cartItems.map((item) => (
                            <div key={item.product._id} className="flex items-center p-6 border-b border-gray-200 last:border-b-0">
                                {/* Product Image */}
                                <div className="flex-shrink-0 w-24 h-24">
                                    <img
                                        src={item.product.images?.[0]?.url || item.product.images?.[0] || '/placeholder.png'}
                                        alt={item.product.title}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="ml-6 flex-1">
                                    <h3 className="text-lg font-medium text-gray-900">{item.product.title}</h3>
                                    <p className="mt-1 text-sm text-gray-500">₹{(item.product.price / 100).toFixed(2)}</p>

                                    {/* Quantity Controls */}
                                    <div className="mt-4 flex items-center space-x-3">
                                        <button
                                            onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            −
                                        </button>
                                        <span className="text-gray-900 font-medium w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Item Total & Remove */}
                                <div className="ml-6 flex flex-col items-end">
                                    <p className="text-lg font-semibold text-gray-900">
                                        ₹{((item.product.price * item.quantity) / 100).toFixed(2)}
                                    </p>
                                    <button
                                        onClick={() => handleRemove(item.product._id)}
                                        className="mt-4 text-sm text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white shadow-md rounded-lg p-6 sticky top-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                                <span className="text-gray-900 font-medium">₹{(subtotal / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="text-gray-900">Calculated at checkout</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax</span>
                                <span className="text-gray-900">Calculated at checkout</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-base font-semibold text-gray-900">Estimated Total</span>
                                <span className="text-base font-semibold text-gray-900">₹{(subtotal / 100).toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full px-6 py-3 bg-velvet-purple text-white rounded-md hover:bg-velvet-purple-dark focus:outline-none focus:ring-2 focus:ring-velvet-purple focus:ring-offset-2"
                        >
                            Proceed to Checkout
                        </button>

                        <button
                            onClick={() => navigate('/products')}
                            className="w-full mt-3 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-velvet-purple focus:ring-offset-2"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
