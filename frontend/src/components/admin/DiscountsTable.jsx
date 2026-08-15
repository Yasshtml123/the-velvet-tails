import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDiscounts, deleteDiscount, clearError } from '@/features/discountsSlice.js';
import { formatDate } from '@/utils/formatters.js';

export default function DiscountsTable() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { discounts, isLoading, error } = useSelector((state) => state.discounts);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        dispatch(fetchDiscounts());
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (deleteConfirm === id) {
            await dispatch(deleteDiscount(id));
            setDeleteConfirm(null);
        } else {
            setDeleteConfirm(id);
            setTimeout(() => setDeleteConfirm(null), 3000);
        }
    };

    const formatDiscountValue = (discount) => {
        if (discount.type === 'percentage') {
            return `${discount.value}%`;
        }
        return `₹${(discount.value / 100).toFixed(2)}`;
    };

    const getStatus = (discount) => {
        if (!discount.active) return { text: 'Inactive', color: 'gray' };

        const now = new Date();
        if (discount.startsAt && now < new Date(discount.startsAt)) {
            return { text: 'Scheduled', color: 'blue' };
        }
        if (discount.endsAt && now > new Date(discount.endsAt)) {
            return { text: 'Expired', color: 'red' };
        }
        if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
            return { text: 'Limit Reached', color: 'orange' };
        }
        return { text: 'Active', color: 'green' };
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-600">Loading discounts...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Discount Codes</h1>
                <button
                    onClick={() => navigate('/admin/discounts/new')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Create Discount
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex justify-between items-center">
                    <span className="text-red-800">{error}</span>
                    <button
                        onClick={() => dispatch(clearError())}
                        className="text-red-600 hover:text-red-800"
                    >
                        ✕
                    </button>
                </div>
            )}

            {discounts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-4">No discount codes yet</p>
                    <button
                        onClick={() => navigate('/admin/discounts/new')}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Create your first discount
                    </button>
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
                                            Code
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Value
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usage
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Valid Period
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {discounts.map((discount) => {
                                        const status = getStatus(discount);
                                        return (
                                            <tr key={discount._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{discount.code}</div>
                                                    {discount.description && (
                                                        <div className="text-sm text-gray-500">{discount.description}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900 capitalize">{discount.type}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {formatDiscountValue(discount)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${status.color}-100 text-${status.color}-800`}
                                                    >
                                                        {status.text}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {discount.usedCount} {discount.usageLimit ? `/ ${discount.usageLimit}` : ''}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {discount.startsAt && <div>From: {formatDate(discount.startsAt)}</div>}
                                                    {discount.endsAt && <div>To: {formatDate(discount.endsAt)}</div>}
                                                    {!discount.startsAt && !discount.endsAt && <span>No limit</span>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => navigate(`/admin/discounts/${discount._id}/edit`)}
                                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(discount._id)}
                                                        className={`${deleteConfirm === discount._id
                                                            ? 'text-red-600 hover:text-red-900 font-bold'
                                                            : 'text-red-600 hover:text-red-900'
                                                            }`}
                                                    >
                                                        {deleteConfirm === discount._id ? 'Confirm?' : 'Delete'}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card Layout - Shown only on mobile */}
                    <div className="md:hidden space-y-4">
                        {discounts.map((discount) => {
                            const status = getStatus(discount);
                            return (
                                <div key={discount._id} className="bg-white shadow-md rounded-lg p-4">
                                    {/* Header: Code & Status */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">{discount.code}</div>
                                            {discount.description && (
                                                <div className="text-xs text-gray-500">{discount.description}</div>
                                            )}
                                        </div>
                                        <span
                                            className={`px-2 py-1 text-xs font-semibold rounded-full bg-${status.color}-100 text-${status.color}-800`}
                                        >
                                            {status.text}
                                        </span>
                                    </div>

                                    {/* Discount Details */}
                                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                        <div>
                                            <span className="text-gray-500">Type: </span>
                                            <span className="font-medium capitalize">{discount.type}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Value: </span>
                                            <span className="font-medium">{formatDiscountValue(discount)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Usage: </span>
                                            <span className="font-medium">
                                                {discount.usedCount} {discount.usageLimit ? `/ ${discount.usageLimit}` : ''}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Valid Period */}
                                    <div className="text-xs text-gray-400 mb-3">
                                        {discount.startsAt && <div>From: {formatDate(discount.startsAt)}</div>}
                                        {discount.endsAt && <div>To: {formatDate(discount.endsAt)}</div>}
                                        {!discount.startsAt && !discount.endsAt && <span>No time limit</span>}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/discounts/${discount._id}/edit`)}
                                            className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(discount._id)}
                                            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${deleteConfirm === discount._id
                                                ? 'bg-red-600 text-white hover:bg-red-700'
                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                }`}
                                        >
                                            {deleteConfirm === discount._id ? 'Confirm Delete?' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
