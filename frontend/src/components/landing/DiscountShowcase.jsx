import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchDiscounts } from '@/features/discountsSlice.js';

export default function DiscountShowcase() {
    const dispatch = useDispatch();

    // Safely access discounts from Redux store with fallbacks
    const discountsState = useSelector((state) => state.discounts);
    const discounts = discountsState?.discounts || [];
    const isLoading = discountsState?.isLoading;
    const hasFetched = discountsState?.hasFetched;

    // Fetch discounts on component mount - only if not already fetched
    useEffect(() => {
        if (!hasFetched && !isLoading) {
            dispatch(fetchDiscounts());
        }
    }, [dispatch, hasFetched, isLoading]);

    // Get active discounts with error handling
    const activeDiscounts = discounts.filter(d => {
        try {
            return d.active && new Date(d.endsAt) > new Date();  // Fixed: use endsAt not expiresAt
        } catch (error) {
            return false;
        }
    }).slice(0, 6); // Show max 6 discounts

    if (activeDiscounts.length === 0) return null;

    // Brand colors matching velvet theme
    const brandColors = [
        'from-velvet-purple to-purple-700',
        'from-velvet-golden to-amber-600',
        'from-purple-500 to-velvet-purple',
        'from-amber-500 to-velvet-golden',
        'from-rose-400 to-purple-600',
        'from-fuchsia-500 to-velvet-purple'
    ];

    return (
        <div className="py-16 bg-gradient-to-b from-purple-100 via-amber-50 to-purple-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 relative">
                    {/* Decorative tag icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-velvet-purple to-purple-700 rounded-full mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-velvet-purple via-purple-600 to-velvet-purple bg-clip-text text-transparent mb-3">
                        Exclusive Offers & Deals!
                    </h2>

                    {/* Decorative line */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-velvet-golden"></div>
                        <div className="w-2 h-2 bg-velvet-golden rounded-full"></div>
                        <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-velvet-golden"></div>
                    </div>

                    <p className="text-lg text-gray-600">
                        Exclusive offers on premium pet products
                    </p>
                </div>

                {/* Discount Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {activeDiscounts.map((discount, index) => (
                        <div
                            key={discount._id}
                            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                        >
                            {/* Card Background with Gradient */}
                            <div className={`bg-gradient-to-br ${brandColors[index % brandColors.length]} p-6 h-48 flex flex-col items-center justify-center text-white`}>
                                {/* Discount Badge */}
                                <div className="text-center mb-3">
                                    <div className="text-4xl font-bold mb-1">
                                        {discount.type === 'percentage' ? `${discount.value}%` : `₹${(discount.value / 100).toFixed(2)}`}
                                    </div>
                                    <div className="text-sm font-semibold uppercase tracking-wide">
                                        {discount.type === 'percentage' ? 'OFF' : 'FLAT'}
                                    </div>
                                </div>

                                {/* Discount Code */}
                                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                                    <div className="text-xs font-medium mb-1">Use Code:</div>
                                    <div className="text-sm font-bold tracking-wider">{discount.code}</div>
                                </div>

                                {/* Minimum Order Info */}
                                {discount.minOrderValue > 0 && (
                                    <div className="mt-3 text-xs opacity-90">
                                        Min. Order: ₹{(discount.minOrderValue / 100).toFixed(2)}
                                    </div>
                                )}
                            </div>

                            {/* Hover Effect Overlay */}
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    ))}
                </div>

                {/* View All Offers Button */}
                {activeDiscounts.length > 0 && (
                    <div className="text-center mt-8">
                        <button
                            onClick={() => {
                                // Scroll to products or show all discounts
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="inline-flex items-center px-6 py-3 bg-velvet-purple hover:bg-velvet-purple/90 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                        >
                            View All Offers
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
