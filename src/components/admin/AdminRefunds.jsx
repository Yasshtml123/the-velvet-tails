import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRefunds, approveRefund, rejectRefund, setFilter, clearError } from '@/features/refundsSlice.js';
import { formatDate, formatPrice } from '@/utils/formatters.js';
import ConfirmModal from '@/components/common/ConfirmModal.jsx';

export default function AdminRefunds() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { refunds, isLoading, error, currentFilter } = useSelector((state) => state.refunds);

    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedRefund, setSelectedRefund] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        dispatch(fetchRefunds({ status: currentFilter }));
    }, [dispatch, currentFilter]);

    const handleFilterChange = (status) => {
        dispatch(setFilter(status));
        dispatch(fetchRefunds({ status }));
    };

    const handleApproveClick = (refund) => {
        setSelectedRefund(refund);
        setShowApproveModal(true);
    };

    const handleRejectClick = (refund) => {
        setSelectedRefund(refund);
        setShowRejectModal(true);
        setRejectReason('');
    };

    const confirmApprove = async () => {
        try {
            await dispatch(approveRefund(selectedRefund._id)).unwrap();
            alert('Refund approved successfully!');
            setShowApproveModal(false);
            setSelectedRefund(null);
        } catch (err) {
            console.error('Failed to approve refund:', err);
        }
    };

    const confirmReject = async () => {
        if (!rejectReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        try {
            await dispatch(rejectRefund({ orderId: selectedRefund._id, reason: rejectReason })).unwrap();
            alert('Refund rejected successfully');
            setShowRejectModal(false);
            setSelectedRefund(null);
            setRejectReason('');
        } catch (err) {
            console.error('Failed to reject refund:', err);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            requested: 'yellow',
            processing: 'blue',
            refunded: 'green',
            failed: 'red'
        };
        return colors[status] || 'gray';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Refund Requests</h1>
                <p className="text-gray-600 mt-2">Manage customer refund requests</p>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex justify-between items-center">
                    <span className="text-red-800">{error}</span>
                    <button onClick={() => dispatch(clearError())} className="text-red-600 hover:text-red-800">
                        ✕
                    </button>
                </div>
            )}

            {/* Status Filter Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {['requested', 'processing', 'refunded', 'failed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => handleFilterChange(status)}
                            className={`${currentFilter === status
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                        >
                            {status}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Refunds List */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-600">Loading refunds...</div>
                </div>
            ) : refunds.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No {currentFilter} refunds found</p>
                </div>
            ) : (
                <>
                    {/* Desktop Table - Hidden on mobile */}
                    <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Reason
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Requested
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {refunds.map((refund) => (
                                        <tr key={refund._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {refund.orderNumber}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{refund.userId?.name || 'N/A'}</div>
                                                <div className="text-sm text-gray-500">{refund.userId?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatPrice(refund.amount)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-xs truncate">
                                                    {refund.refundReason || 'No reason provided'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {formatDate(refund.refundRequestedAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${getStatusColor(refund.refundStatus)}-100 text-${getStatusColor(refund.refundStatus)}-800`}>
                                                    {refund.refundStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => navigate(`/admin/orders/${refund._id}`)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    View
                                                </button>
                                                {refund.refundStatus === 'requested' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApproveClick(refund)}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectClick(refund)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card Layout - Shown only on mobile */}
                    <div className="md:hidden space-y-4">
                        {refunds.map((refund) => (
                            <div key={refund._id} className="bg-white shadow-md rounded-lg p-4">
                                {/* Header: Order & Amount */}
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">
                                            {refund.orderNumber}
                                        </div>
                                        <span className={`mt-1 px-2 py-0.5 inline-flex text-xs font-semibold rounded-full bg-${getStatusColor(refund.refundStatus)}-100 text-${getStatusColor(refund.refundStatus)}-800`}>
                                            {refund.refundStatus}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gray-900">
                                            {formatPrice(refund.amount)}
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="text-sm text-gray-600 mb-2">
                                    <div className="font-medium">{refund.userId?.name || 'N/A'}</div>
                                    <div className="text-xs text-gray-400 truncate">{refund.userId?.email}</div>
                                </div>

                                {/* Reason */}
                                <div className="text-sm text-gray-600 mb-2">
                                    <span className="font-medium text-gray-700">Reason: </span>
                                    <span className="text-gray-500">{refund.refundReason || 'No reason provided'}</span>
                                </div>

                                {/* Date */}
                                <div className="text-xs text-gray-400 mb-3">
                                    Requested: {formatDate(refund.refundRequestedAt)}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/admin/orders/${refund._id}`)}
                                        className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                    >
                                        View
                                    </button>
                                    {refund.refundStatus === 'requested' && (
                                        <>
                                            <button
                                                onClick={() => handleApproveClick(refund)}
                                                className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleRejectClick(refund)}
                                                className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Approve Modal */}
            {selectedRefund && (
                <ConfirmModal
                    isOpen={showApproveModal}
                    onClose={() => setShowApproveModal(false)}
                    onConfirm={confirmApprove}
                    title="Approve Refund?"
                    message={`Are you sure you want to approve this refund?\n\nOrder: ${selectedRefund.orderNumber}\nAmount: ${formatPrice(selectedRefund.amount)}\nReason: ${selectedRefund.refundReason}\n\nThis will initiate a PayU refund and credit the customer's account.`}
                    confirmText="Approve Refund"
                    cancelText="Cancel"
                    type="primary"
                />
            )}

            {/* Reject Modal */}
            {selectedRefund && showRejectModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowRejectModal(false)}></div>

                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                Reject Refund?
                            </h3>

                            <div className="mb-4 text-sm text-gray-600">
                                <p><strong>Order:</strong> {selectedRefund.orderNumber}</p>
                                <p><strong>Amount:</strong> {formatPrice(selectedRefund.amount)}</p>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="rejectReason" className="block text-sm font-medium text-gray-700 mb-2">
                                    Rejection Reason *
                                </label>
                                <textarea
                                    id="rejectReason"
                                    rows={3}
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Explain why this refund is being rejected..."
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmReject}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                    Reject Refund
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
