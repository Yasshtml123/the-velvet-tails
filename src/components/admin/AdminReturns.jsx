import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReturns, approveReturn, rejectReturn, completeReturn, clearError, clearSuccess } from '@/features/returnsSlice.js';
import { formatDate } from '@/utils/formatters.js';

export default function AdminReturns() {
    const dispatch = useDispatch();
    const { returns, isLoading, error, success } = useSelector((state) => state.returns);
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(null);

    useEffect(() => {
        dispatch(fetchReturns({ status: statusFilter || undefined }));
    }, [dispatch, statusFilter]);

    useEffect(() => {
        if (success) {
            setTimeout(() => dispatch(clearSuccess()), 3000);
        }
    }, [success, dispatch]);

    const handleAction = (returnOrder, action) => {
        setSelectedReturn(returnOrder);
        setModalAction(action);
        setAdminNotes('');
        setShowModal(true);
    };

    const confirmAction = async () => {
        if (!selectedReturn) return;

        try {
            if (modalAction === 'approve') {
                await dispatch(approveReturn({ orderId: selectedReturn._id, adminNotes })).unwrap();
            } else if (modalAction === 'reject') {
                await dispatch(rejectReturn({ orderId: selectedReturn._id, adminNotes })).unwrap();
            } else if (modalAction === 'complete') {
                await dispatch(completeReturn({ orderId: selectedReturn._id })).unwrap();
            }
            setShowModal(false);
            dispatch(fetchReturns({ status: statusFilter || undefined }));
        } catch (err) {
            console.error('Action failed:', err);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            requested: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-blue-100 text-blue-800',
            pickup_scheduled: 'bg-indigo-100 text-indigo-800',
            picked_up: 'bg-purple-100 text-purple-800',
            completed: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Return Requests</h1>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-velvet-purple focus:border-transparent"
                >
                    <option value="">All Returns</option>
                    <option value="requested">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="pickup_scheduled">Pickup Scheduled</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
                    <span className="text-red-800">{error}</span>
                    <button onClick={() => dispatch(clearError())} className="text-red-600 hover:text-red-800">×</button>
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-green-800">{success}</span>
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading return requests...</div>
            ) : returns.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No return requests found</p>
                </div>
            ) : (
                <>
                    {/* Desktop Table - Hidden on mobile */}
                    <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {returns.map((ret) => (
                                    <tr key={ret._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{ret.orderNumber}</div>
                                            <div className="text-sm text-gray-500">₹{(ret.amount / 100).toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{ret.userId?.name || 'N/A'}</div>
                                            <div className="text-sm text-gray-500">{ret.userId?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate" title={ret.returnRequest?.reason}>
                                                {ret.returnRequest?.reason}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(ret.returnRequest?.status)}`}>
                                                {ret.returnRequest?.status?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(ret.returnRequest?.requestedAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex gap-2">
                                                {ret.returnRequest?.status === 'requested' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleAction(ret, 'approve')}
                                                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(ret, 'reject')}
                                                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {['approved', 'pickup_scheduled', 'picked_up'].includes(ret.returnRequest?.status) && (
                                                    <button
                                                        onClick={() => handleAction(ret, 'complete')}
                                                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                                    >
                                                        Mark Complete
                                                    </button>
                                                )}
                                                {ret.returnRequest?.status === 'completed' && (
                                                    <span className="text-green-600 text-xs">✓ Completed</span>
                                                )}
                                                {ret.returnRequest?.status === 'rejected' && (
                                                    <span className="text-red-600 text-xs">✗ Rejected</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card Layout - Shown only on mobile */}
                    <div className="md:hidden space-y-4">
                        {returns.map((ret) => (
                            <div key={ret._id} className="bg-white shadow-md rounded-lg p-4">
                                {/* Header: Order & Amount */}
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">{ret.orderNumber}</div>
                                        <span className={`mt-1 px-2 py-0.5 inline-flex text-xs font-medium rounded-full ${getStatusBadge(ret.returnRequest?.status)}`}>
                                            {ret.returnRequest?.status?.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gray-900">₹{(ret.amount / 100).toFixed(2)}</div>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="text-sm text-gray-600 mb-2">
                                    <div className="font-medium">{ret.userId?.name || 'N/A'}</div>
                                    <div className="text-xs text-gray-400 truncate">{ret.userId?.email}</div>
                                </div>

                                {/* Reason */}
                                <div className="text-sm text-gray-600 mb-2">
                                    <span className="font-medium text-gray-700">Reason: </span>
                                    <span className="text-gray-500">{ret.returnRequest?.reason || 'No reason provided'}</span>
                                </div>

                                {/* Date */}
                                <div className="text-xs text-gray-400 mb-3">
                                    Requested: {formatDate(ret.returnRequest?.requestedAt)}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    {ret.returnRequest?.status === 'requested' && (
                                        <>
                                            <button
                                                onClick={() => handleAction(ret, 'approve')}
                                                className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(ret, 'reject')}
                                                className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {['approved', 'pickup_scheduled', 'picked_up'].includes(ret.returnRequest?.status) && (
                                        <button
                                            onClick={() => handleAction(ret, 'complete')}
                                            className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                        >
                                            Mark Complete
                                        </button>
                                    )}
                                    {ret.returnRequest?.status === 'completed' && (
                                        <div className="flex-1 py-2 px-3 bg-green-100 text-green-800 text-sm font-medium rounded-lg text-center">
                                            ✓ Completed
                                        </div>
                                    )}
                                    {ret.returnRequest?.status === 'rejected' && (
                                        <div className="flex-1 py-2 px-3 bg-red-100 text-red-800 text-sm font-medium rounded-lg text-center">
                                            ✗ Rejected
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Action Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowModal(false)} />
                        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {modalAction === 'approve' && 'Approve Return'}
                                {modalAction === 'reject' && 'Reject Return'}
                                {modalAction === 'complete' && 'Complete Return'}
                            </h3>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600">
                                    Order: <span className="font-medium">{selectedReturn?.orderNumber}</span>
                                </p>
                                <p className="text-sm text-gray-600">
                                    Return reason: <span className="font-medium">{selectedReturn?.returnRequest?.reason}</span>
                                </p>
                            </div>

                            {modalAction !== 'complete' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Admin Notes {modalAction === 'reject' && '(Reason)'}
                                    </label>
                                    <textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-velvet-purple"
                                        placeholder={modalAction === 'reject' ? 'Reason for rejection...' : 'Optional notes...'}
                                    />
                                </div>
                            )}

                            {modalAction === 'complete' && (
                                <p className="text-sm text-amber-600 mb-4">
                                    This will create a refund request for this order.
                                </p>
                            )}

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmAction}
                                    disabled={isLoading}
                                    className={`px-4 py-2 text-white rounded-md disabled:opacity-50 ${modalAction === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                >
                                    {isLoading ? 'Processing...' : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
