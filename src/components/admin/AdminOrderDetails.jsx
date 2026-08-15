import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAdminOrderById, updateOrderStatus, shipOrder, clearError } from '@/features/adminOrdersSlice.js';
import { formatDate } from '@/utils/formatters.js';
import ConfirmModal from '@/components/common/ConfirmModal.jsx';
import api from '@/services/api.js';

export default function AdminOrderDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentOrder, isLoading, error } = useSelector((state) => state.adminOrders);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [showStatusConfirm, setShowStatusConfirm] = useState(false);
    const [showShipModal, setShowShipModal] = useState(false);
    const [downloadingInvoice, setDownloadingInvoice] = useState(false);

    useEffect(() => {
        dispatch(fetchAdminOrderById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (currentOrder) {
            setSelectedStatus(currentOrder.status);
        }
    }, [currentOrder]);

    const handleStatusUpdate = async () => {
        if (selectedStatus === currentOrder.status) {
            setShowStatusConfirm(false);
            return;
        }

        try {
            await dispatch(updateOrderStatus({ orderId: id, status: selectedStatus })).unwrap();
            setShowStatusConfirm(false);
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

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

    const getPaymentStatusColor = (status) => {
        const colors = {
            pending: 'yellow',
            paid: 'green',
            failed: 'red',
            refunded: 'orange'
        };
        return colors[status] || 'gray';
    };

    const canUpdateStatus = (order) => {
        return order.status !== 'delivered' && order.status !== 'cancelled';
    };

    const canShip = (order) => {
        return order.payment.status === 'paid' &&
            order.status === 'processing' &&
            !order.logistics?.awb;
    };

    const handleShipOrder = async () => {
        try {
            await dispatch(shipOrder(id)).unwrap();
            alert('Order shipped successfully!');
        } catch (err) {
            console.error('Failed to ship order:', err);
        }
    };

    const handleDownloadInvoice = async () => {
        try {
            setDownloadingInvoice(true);
            const response = await api.get(`/admin/orders/${id}/invoice`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice-${currentOrder.orderNumber}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download invoice:', err);
            alert('Failed to download invoice. Please try again.');
        } finally {
            setDownloadingInvoice(false);
        }
    };

    if (isLoading && !currentOrder) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-600">Loading order details...</div>
            </div>
        );
    }

    if (!currentOrder) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    ← Back to Orders
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Order #{currentOrder.orderNumber || currentOrder._id.slice(-8).toUpperCase()}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Placed on {formatDate(currentOrder.createdAt)}
                            </p>
                            <p className="text-sm text-gray-500">
                                Customer: {currentOrder.userId?.email || 'N/A'}
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex flex-col space-y-2">
                            <span
                                className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-${getStatusColor(currentOrder.status)}-100 text-${getStatusColor(currentOrder.status)}-800`}
                            >
                                {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                            </span>
                            <span
                                className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-${getPaymentStatusColor(currentOrder.payment.status)}-100 text-${getPaymentStatusColor(currentOrder.payment.status)}-800`}
                            >
                                Payment: {currentOrder.payment.status.charAt(0).toUpperCase() + currentOrder.payment.status.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border-b border-red-200 flex justify-between items-center">
                        <span className="text-red-800">{error}</span>
                        <button onClick={() => dispatch(clearError())} className="text-red-600 hover:text-red-800">
                            ✕
                        </button>
                    </div>
                )}

                {/* Status Management */}
                {canUpdateStatus(currentOrder) && (
                    <div className="p-6 bg-blue-50 border-b border-blue-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Order Status</h2>
                        <div className="flex flex-col sm:flex-row sm:items-end space-y-3 sm:space-y-0 sm:space-x-4">
                            <div className="flex-1">
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Status
                                </label>
                                <select
                                    id="status"
                                    value={selectedStatus}
                                    onChange={(e) => {
                                        setSelectedStatus(e.target.value);
                                        setShowStatusConfirm(true);
                                    }}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            {showStatusConfirm && selectedStatus !== currentOrder.status && (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleStatusUpdate}
                                        disabled={isLoading}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Updating...' : 'Confirm Update'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedStatus(currentOrder.status);
                                            setShowStatusConfirm(false);
                                        }}
                                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Order Items */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                    <div className="space-y-4">
                        {currentOrder.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                                    <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
                                    <p className="text-sm text-gray-500">Price: ₹{(item.price / 100).toFixed(2)} each</p>
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                    ₹{((item.price * item.qty) / 100).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
                    <div className="text-sm text-gray-600">
                        <p className="font-medium text-gray-900">{currentOrder.shippingAddress.name}</p>
                        <p>{currentOrder.shippingAddress.phone}</p>
                        <p>{currentOrder.shippingAddress.street}</p>
                        <p>
                            {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.pincode}
                        </p>
                        <p>{currentOrder.shippingAddress.country || 'India'}</p>
                    </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Price Details</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="text-gray-900">₹{(currentOrder.subtotal / 100).toFixed(2)}</span>
                        </div>
                        {currentOrder.discount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Discount</span>
                                <span className="text-green-600">-₹{(currentOrder.discount / 100).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax</span>
                            <span className="text-gray-900">₹{(currentOrder.tax / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping</span>
                            <span className="text-gray-900">
                                {currentOrder.shippingCost > 0 ? `₹${(currentOrder.shippingCost / 100).toFixed(2)}` : 'Free'}
                            </span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 flex justify-between">
                            <span className="text-base font-semibold text-gray-900">Total</span>
                            <span className="text-base font-semibold text-gray-900">
                                ₹{(currentOrder.amount / 100).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Shipping Management */}
                {canShip(currentOrder) && (
                    <div className="p-6 bg-green-50 border-b border-green-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ship Order</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            This order is ready to be shipped. Click below to create a shipment via Shiprocket.
                        </p>
                        <button
                            onClick={() => setShowShipModal(true)}
                            disabled={isLoading}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Shipping...' : '📦 Ship Order'}
                        </button>
                    </div>
                )}

                {/* Logistics Information */}
                {currentOrder.logistics?.awb && (
                    <div className="p-6 bg-purple-50 border-b border-purple-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">📦 Shipping Information</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Courier:</span>
                                <span className="text-gray-900 font-medium">{currentOrder.logistics.courierName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">AWB Number:</span>
                                <span className="text-gray-900 font-mono font-medium">{currentOrder.logistics.awb}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipped On:</span>
                                <span className="text-gray-900">{formatDate(currentOrder.logistics.shippedAt)}</span>
                            </div>
                            <div className="mt-4">
                                <a
                                    href={`https://shiprocket.co/tracking/${currentOrder.logistics.awb}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                >
                                    Track Shipment →
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment & Cancellation Info */}
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Payment Method:</span>
                            <span className="text-gray-900">{currentOrder.payment.method.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Payment Status:</span>
                            <span className="text-gray-900 capitalize">{currentOrder.payment.status}</span>
                        </div>
                        {currentOrder.status === 'cancelled' && (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Cancelled By:</span>
                                    <span className="text-gray-900">{currentOrder.cancelledBy}</span>
                                </div>
                                {currentOrder.cancellationReason && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Reason:</span>
                                        <span className="text-gray-900">{currentOrder.cancellationReason}</span>
                                    </div>
                                )}
                                {currentOrder.cancelledAt && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Cancelled On:</span>
                                        <span className="text-gray-900">{formatDate(currentOrder.cancelledAt)}</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Download Invoice Button - Only for paid orders */}
                    {currentOrder.payment.status === 'paid' && (
                        <button
                            onClick={handleDownloadInvoice}
                            disabled={downloadingInvoice}
                            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {downloadingInvoice ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Downloading...
                                </>
                            ) : (
                                <>
                                    <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    📄 Download Invoice
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Ship Order Confirmation Modal */}
            <ConfirmModal
                isOpen={showShipModal}
                onClose={() => setShowShipModal(false)}
                onConfirm={handleShipOrder}
                title="Ship this Order?"
                message="This will create a shipment via Shiprocket and update the order status to 'shipped'. The customer will receive tracking information."
                confirmText="Yes, Ship Order"
                cancelText="Cancel"
                type="primary"
            />
        </div>
    );
}
