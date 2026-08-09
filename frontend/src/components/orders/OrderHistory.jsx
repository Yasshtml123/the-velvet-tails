import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrders, clearError } from '@/features/ordersSlice.js';
import { formatDate } from '@/utils/formatters.js';

export default function OrderHistory() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orders, isLoading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const getStatusColor = (status) => {
        const colors = {
            pending: 'yellow',
            confirmed: 'blue',
            processing: 'indigo',
            shipped: 'purple',
            delivered: 'green',
            cancelled: 'red'
        };
        return colors[status] || 'gray';
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-600">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex justify-between items-center">
                    <span className="text-red-800">{error}</span>
                    <button onClick={() => dispatch(clearError())} className="text-red-600 hover:text-red-800">
                        ✕
                    </button>
                </div>
            )}

            {orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="text-velvet-purple hover:text-velvet-purple-dark font-medium"
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Placed on {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                    <div className="mt-2 sm:mt-0">
                                        <span
                                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800`}
                                        >
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-600">
                                                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                            </p>
                                            <p className="text-lg font-semibold text-gray-900">
                                                ₹{(order.amount / 100).toFixed(2)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Payment: {order.payment.status}
                                            </p>
                                        </div>

                                        <div className="mt-4 sm:mt-0 flex space-x-3">
                                            <button
                                                onClick={() => navigate(`/orders/${order._id}`)}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                                View Details
                                            </button>
                                            {order.status === 'pending' || order.status === 'confirmed' ? (
                                                <button
                                                    onClick={() => navigate(`/orders/${order._id}`)}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                >
                                                    Cancel
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
