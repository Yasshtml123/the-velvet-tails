import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { trackOrder, cancelOrder, clearError } from '@/features/ordersSlice.js';
import { requestReturn, clearSuccess, clearError as clearReturnError } from '@/features/returnsSlice.js';
import { formatDate } from '@/utils/formatters.js';
import ConfirmModal from '@/components/common/ConfirmModal.jsx';
import api from '@/services/api.js';

export default function OrderDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentOrder, isLoading, error } = useSelector((state) => state.orders);
    const { isLoading: returnLoading, error: returnError, success: returnSuccess } = useSelector((state) => state.returns);
    const [cancelReason, setCancelReason] = useState('');
    const [showCancelForm, setShowCancelForm] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const [showReturnForm, setShowReturnForm] = useState(false);
    const [downloadingInvoice, setDownloadingInvoice] = useState(false);

    useEffect(() => {
        dispatch(trackOrder(id));
    }, [dispatch, id]);

    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            alert('Please provide a cancellation reason');
            return;
        }

        // Show confirmation modal
        setShowConfirmModal(true);
    };

    const confirmCancellation = async () => {
        try {
            await dispatch(cancelOrder({ orderId: id, reason: cancelReason })).unwrap();
            setShowCancelForm(false);
            setCancelReason('');
        } catch (err) {
            console.error('Failed to cancel order:', err);
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

    // Check if order can request return (delivered within 15 days)
    const canRequestReturn = () => {
        if (currentOrder?.status !== 'delivered') return false;
        if (currentOrder?.returnRequest?.requested) return false;

        const deliveredAt = currentOrder?.logistics?.deliveredAt;
        if (!deliveredAt) return false;

        const daysSinceDelivery = Math.floor((Date.now() - new Date(deliveredAt)) / (1000 * 60 * 60 * 24));
        return daysSinceDelivery <= 15;
    };

    const handleReturnRequest = async () => {
        if (!returnReason.trim()) {
            alert('Please provide a reason for the return');
            return;
        }
        try {
            await dispatch(requestReturn({ orderId: id, reason: returnReason })).unwrap();
            setShowReturnForm(false);
            setReturnReason('');
            // Refresh order data
            dispatch(trackOrder(id));
        } catch (err) {
            console.error('Failed to request return:', err);
        }
    };

    const handleDownloadInvoice = async () => {
        try {
            setDownloadingInvoice(true);
            const response = await api.get(`/orders/${id}/invoice`, {
                responseType: 'blob'
            });

            // Create download link
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
                        onClick={() => navigate('/orders')}
                        className="text-velvet-purple hover:text-velvet-purple-dark"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    const canCancel = currentOrder.status === 'pending' || currentOrder.status === 'confirmed';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/orders')}
                    className="text-velvet-purple hover:text-velvet-purple-dark text-sm font-medium"
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
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <span
                                className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-${getStatusColor(currentOrder.status)}-100 text-${getStatusColor(currentOrder.status)}-800`}
                            >
                                {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
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

                {/* Order Items */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                    <div className="space-y-4">
                        {currentOrder.items.map((item, index) => (
                            <div key={index} className="flex items-center">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                                    <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
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

                {/* Payment Status */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
                    <div className="text-sm">
                        <p className="text-gray-600">
                            Status: <span className="font-medium text-gray-900">{currentOrder.payment.status}</span>
                        </p>
                        <p className="text-gray-600 mt-1">
                            Method: <span className="font-medium text-gray-900">{currentOrder.payment.method.toUpperCase()}</span>
                        </p>
                    </div>

                    {/* Download Invoice Button - Only for paid orders */}
                    {currentOrder.payment.status === 'paid' && (
                        <button
                            onClick={handleDownloadInvoice}
                            disabled={downloadingInvoice}
                            className="mt-4 inline-flex items-center px-4 py-2 bg-velvet-purple text-white text-sm font-medium rounded-md hover:bg-velvet-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-velvet-purple disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                                    Download Invoice
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Cancel Order Section */}
                {canCancel && (
                    <div className="p-6">
                        {!showCancelForm ? (
                            <button
                                onClick={() => setShowCancelForm(true)}
                                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Cancel Order
                            </button>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Cancel Order</h3>
                                <div>
                                    <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700">
                                        Reason for cancellation *
                                    </label>
                                    <textarea
                                        id="cancelReason"
                                        rows={3}
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Please provide a reason..."
                                    />
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleCancelOrder}
                                        disabled={isLoading}
                                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-red-400 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowCancelForm(false);
                                            setCancelReason('');
                                        }}
                                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Keep Order
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {currentOrder.status === 'cancelled' && (
                    <div className="p-6 bg-red-50">
                        <h3 className="text-sm font-semibold text-red-900 mb-2">Order Cancelled</h3>
                        {currentOrder.cancellationReason && (
                            <p className="text-sm text-red-800">Reason: {currentOrder.cancellationReason}</p>
                        )}
                        {currentOrder.cancelledAt && (
                            <p className="text-sm text-red-800">Cancelled on: {formatDate(currentOrder.cancelledAt)}</p>
                        )}
                    </div>
                )}

                {/* Return Request Section */}
                {currentOrder.status === 'delivered' && (
                    <div className="p-6 border-t border-gray-200">
                        {/* Already has return request */}
                        {currentOrder.returnRequest?.requested ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <h3 className="font-semibold text-amber-900 mb-2">Return Request</h3>
                                <p className="text-sm text-amber-800">
                                    Status: <span className="font-medium capitalize">{currentOrder.returnRequest.status}</span>
                                </p>
                                <p className="text-sm text-amber-800 mt-1">
                                    Reason: {currentOrder.returnRequest.reason}
                                </p>
                                {currentOrder.returnRequest.adminNotes && (
                                    <p className="text-sm text-amber-800 mt-1">
                                        Admin notes: {currentOrder.returnRequest.adminNotes}
                                    </p>
                                )}
                                {currentOrder.returnRequest.returnAwb && (
                                    <p className="text-sm text-amber-800 mt-1">
                                        Return AWB: {currentOrder.returnRequest.returnAwb} ({currentOrder.returnRequest.returnCourier})
                                    </p>
                                )}
                            </div>
                        ) : canRequestReturn() ? (
                            /* Can request return */
                            !showReturnForm ? (
                                <div>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Not happy with your order? You can request a return within 15 days of delivery.
                                    </p>
                                    <button
                                        onClick={() => setShowReturnForm(true)}
                                        className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                    >
                                        Request Return
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Request Return</h3>
                                    {returnError && (
                                        <div className="bg-red-50 border border-red-200 rounded p-3 flex justify-between">
                                            <span className="text-sm text-red-800">{returnError}</span>
                                            <button onClick={() => dispatch(clearReturnError())} className="text-red-600">×</button>
                                        </div>
                                    )}
                                    {returnSuccess && (
                                        <div className="bg-green-50 border border-green-200 rounded p-3">
                                            <span className="text-sm text-green-800">{returnSuccess}</span>
                                        </div>
                                    )}
                                    <div>
                                        <label htmlFor="returnReason" className="block text-sm font-medium text-gray-700">
                                            Reason for return *
                                        </label>
                                        <textarea
                                            id="returnReason"
                                            rows={3}
                                            value={returnReason}
                                            onChange={(e) => setReturnReason(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                                            placeholder="Please describe why you want to return this order..."
                                        />
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={handleReturnRequest}
                                            disabled={returnLoading}
                                            className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-amber-400"
                                        >
                                            {returnLoading ? 'Submitting...' : 'Submit Return Request'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowReturnForm(false);
                                                setReturnReason('');
                                            }}
                                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )
                        ) : (
                            /* Return window expired */
                            <div className="text-sm text-gray-500">
                                <p>Return window has expired (15 days from delivery).</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={confirmCancellation}
                title="Cancel Order?"
                message={`Are you sure you want to cancel this order? This action cannot be undone. Your reason: "${cancelReason}"`}
                confirmText="Yes, Cancel Order"
                cancelText="No, Keep Order"
                type="danger"
            />
        </div>
    );
}
