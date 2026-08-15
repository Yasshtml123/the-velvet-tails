import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createDiscount, updateDiscount, fetchDiscountById, clearCurrentDiscount } from '@/features/discountsSlice.js';

export default function DiscountForm() {
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentDiscount, isLoading, error } = useSelector((state) => state.discounts);

    const [formData, setFormData] = useState({
        code: '',
        type: 'percentage',
        value: '',
        active: true,
        startsAt: '',
        endsAt: '',
        usageLimit: '',
        description: '',
        minOrderValue: '',
        maxDiscountAmount: '',
        firstTimeOnly: false
    });

    useEffect(() => {
        if (isEditMode) {
            dispatch(fetchDiscountById(id));
        }
        return () => {
            dispatch(clearCurrentDiscount());
        };
    }, [dispatch, id, isEditMode]);

    useEffect(() => {
        if (isEditMode && currentDiscount) {
            setFormData({
                code: currentDiscount.code || '',
                type: currentDiscount.type || 'percentage',
                value: currentDiscount.type === 'fixed'
                    ? (currentDiscount.value / 100).toFixed(2)
                    : currentDiscount.value || '',
                active: currentDiscount.active ?? true,
                startsAt: currentDiscount.startsAt ? new Date(currentDiscount.startsAt).toISOString().slice(0, 16) : '',
                endsAt: currentDiscount.endsAt ? new Date(currentDiscount.endsAt).toISOString().slice(0, 16) : '',
                usageLimit: currentDiscount.usageLimit || '',
                description: currentDiscount.description || '',
                minOrderValue: currentDiscount.minOrderValue ? (currentDiscount.minOrderValue / 100).toFixed(2) : '',
                maxDiscountAmount: currentDiscount.maxDiscountAmount ? (currentDiscount.maxDiscountAmount / 100).toFixed(2) : '',
                firstTimeOnly: currentDiscount.firstTimeOnly ?? false
            });
        }
    }, [currentDiscount, isEditMode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const discountData = {
            code: formData.code.toUpperCase(),
            type: formData.type,
            value: formData.type === 'fixed'
                ? parseFloat(formData.value).toFixed(2)
                : parseFloat(formData.value),
            active: formData.active
        };

        if (formData.startsAt) discountData.startsAt = new Date(formData.startsAt).toISOString();
        if (formData.endsAt) discountData.endsAt = new Date(formData.endsAt).toISOString();
        if (formData.usageLimit) discountData.usageLimit = parseInt(formData.usageLimit);
        if (formData.description) discountData.description = formData.description;
        if (formData.minOrderValue) discountData.minOrderValue = parseFloat(formData.minOrderValue).toFixed(2);
        if (formData.maxDiscountAmount) discountData.maxDiscountAmount = parseFloat(formData.maxDiscountAmount).toFixed(2);
        discountData.firstTimeOnly = formData.firstTimeOnly;

        try {
            if (isEditMode) {
                await dispatch(updateDiscount({ id, updates: discountData })).unwrap();
            } else {
                await dispatch(createDiscount(discountData)).unwrap();
            }
            navigate('/admin/discounts');
        } catch (err) {
            console.error('Failed to save discount:', err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                {isEditMode ? 'Edit Discount' : 'Create Discount'}
            </h1>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <span className="text-red-800">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                            Discount Code *
                        </label>
                        <input
                            type="text"
                            id="code"
                            name="code"
                            required
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="e.g., WELCOME10"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md uppercase focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">Will be converted to uppercase</p>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={2}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="e.g., New year sale - 20% off"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="active"
                            name="active"
                            checked={formData.active}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                            Active
                        </label>
                    </div>
                </div>

                {/* Discount Value */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Discount Value</h2>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Type *
                        </label>
                        <select
                            id="type"
                            name="type"
                            required
                            value={formData.type}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                            {formData.type === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'} *
                        </label>
                        <input
                            type="number"
                            id="value"
                            name="value"
                            required
                            step={formData.type === 'percentage' ? '1' : '0.01'}
                            min="0"
                            max={formData.type === 'percentage' ? '100' : undefined}
                            value={formData.value}
                            onChange={handleChange}
                            onWheel={(e) => e.target.blur()}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            {formData.type === 'percentage'
                                ? 'Enter value between 0-100'
                                : 'Enter amount in rupees'}
                        </p>
                    </div>
                </div>

                {/* Validity Period */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Validity Period</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startsAt" className="block text-sm font-medium text-gray-700">
                                Start Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                id="startsAt"
                                name="startsAt"
                                value={formData.startsAt}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="endsAt" className="block text-sm font-medium text-gray-700">
                                End Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                id="endsAt"
                                name="endsAt"
                                value={formData.endsAt}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Usage Limits */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Usage Limits</h2>

                    <div>
                        <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700">
                            Maximum Uses
                        </label>
                        <input
                            type="number"
                            id="usageLimit"
                            name="usageLimit"
                            min="1"
                            value={formData.usageLimit}
                            onChange={handleChange}
                            onWheel={(e) => e.target.blur()}
                            placeholder="Leave empty for unlimited"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                type="checkbox"
                                id="firstTimeOnly"
                                name="firstTimeOnly"
                                checked={formData.firstTimeOnly}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                        </div>
                        <div className="ml-3">
                            <label htmlFor="firstTimeOnly" className="font-medium text-gray-700">
                                First-time customers only
                            </label>
                            <p className="text-sm text-gray-500">
                                This discount will only work for users with no previous completed orders
                            </p>
                        </div>
                    </div>
                </div>

                {/* Order Constraints */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Order Constraints</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="minOrderValue" className="block text-sm font-medium text-gray-700">
                                Minimum Order Value (₹)
                            </label>
                            <input
                                type="number"
                                id="minOrderValue"
                                name="minOrderValue"
                                step="0.01"
                                min="0"
                                value={formData.minOrderValue}
                                onChange={handleChange}
                                onWheel={(e) => e.target.blur()}
                                placeholder="No minimum"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="maxDiscountAmount" className="block text-sm font-medium text-gray-700">
                                Maximum Discount Cap (₹)
                            </label>
                            <input
                                type="number"
                                id="maxDiscountAmount"
                                name="maxDiscountAmount"
                                step="0.01"
                                min="0"
                                value={formData.maxDiscountAmount}
                                onChange={handleChange}
                                onWheel={(e) => e.target.blur()}
                                placeholder="No cap"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="mt-1 text-sm text-gray-500">Useful for percentage discounts</p>
                        </div>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/discounts')}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Saving...' : isEditMode ? 'Update Discount' : 'Create Discount'}
                    </button>
                </div>
            </form>
        </div>
    );
}
