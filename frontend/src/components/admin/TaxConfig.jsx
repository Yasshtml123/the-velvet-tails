import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTaxConfig, updateTaxConfig, clearError } from '@/features/taxSlice.js';

export default function TaxConfig() {
    const dispatch = useDispatch();
    const { config, isLoading, error } = useSelector((state) => state.tax);

    const [formData, setFormData] = useState({
        name: '',
        rate: '',
        inclusive: false,
        isActive: true,
        description: ''
    });

    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        dispatch(fetchTaxConfig());
    }, [dispatch]);

    useEffect(() => {
        if (config) {
            setFormData({
                name: config.name || '',
                rate: config.rate || '',
                inclusive: config.inclusive ?? false,
                isActive: config.isActive ?? true,
                description: config.description || ''
            });
        }
    }, [config]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');

        const taxData = {
            name: formData.name,
            rate: parseFloat(formData.rate),
            inclusive: formData.inclusive,
            isActive: formData.isActive
        };

        if (formData.description) {
            taxData.description = formData.description;
        }

        try {
            await dispatch(updateTaxConfig(taxData)).unwrap();
            setSuccessMessage('Tax configuration updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Failed to update tax config:', err);
        }
    };

    if (isLoading && !config) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-600">Loading tax configuration...</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Tax Configuration</h1>

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

            {successMessage && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <span className="text-green-800">{successMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Tax Details</h2>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Tax Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., GST, VAT, Sales Tax"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="rate" className="block text-sm font-medium text-gray-700">
                            Tax Rate (%) *
                        </label>
                        <input
                            type="number"
                            id="rate"
                            name="rate"
                            required
                            step="0.01"
                            min="0"
                            max="100"
                            value={formData.rate}
                            onChange={handleChange}
                            onWheel={(e) => e.target.blur()}
                            placeholder="e.g., 18"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">Enter percentage (0-100)</p>
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
                            placeholder="Additional information about the tax"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Tax Settings */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Tax Settings</h2>

                    <div className="space-y-3">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    type="checkbox"
                                    id="inclusive"
                                    name="inclusive"
                                    checked={formData.inclusive}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3">
                                <label htmlFor="inclusive" className="font-medium text-sm text-gray-900">
                                    Tax Inclusive Pricing
                                </label>
                                <p className="text-sm text-gray-500">
                                    Product prices already include tax (tax is extracted from the price)
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3">
                                <label htmlFor="isActive" className="font-medium text-sm text-gray-900">
                                    Active
                                </label>
                                <p className="text-sm text-gray-500">
                                    Enable tax calculation for orders
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">How Tax Works</h3>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                        <li>
                            <strong>Tax Exclusive:</strong> Tax is added on top of product prices at checkout
                        </li>
                        <li>
                            <strong>Tax Inclusive:</strong> Product prices already include tax (tax is calculated backwards)
                        </li>
                        <li>
                            Example: ₹100 product with 18% tax
                            <ul className="ml-6 mt-1 space-y-1">
                                <li>Exclusive: Customer pays ₹118 (₹100 + ₹18 tax)</li>
                                <li>Inclusive: Customer pays ₹100 (includes ₹15.25 tax)</li>
                            </ul>
                        </li>
                    </ul>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </form>
        </div>
    );
}
