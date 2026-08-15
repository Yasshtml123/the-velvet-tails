import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDiscounts } from '@/features/discountsSlice.js';

export default function HeroBanner({ onShopNow }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentDiscountIndex, setCurrentDiscountIndex] = useState(0);
    const dispatch = useDispatch();

    const discountsState = useSelector((state) => state.discounts);
    const discounts = discountsState?.discounts || [];
    const isLoading = discountsState?.isLoading;
    const hasFetched = discountsState?.hasFetched;

    useEffect(() => {
        if (!hasFetched && !isLoading) {
            dispatch(fetchDiscounts());
        }
    }, [dispatch, hasFetched, isLoading]);

    const activeDiscounts = discounts.filter(d => {
        try {
            return d.active && new Date(d.endsAt) > new Date();
        } catch (error) {
            return false;
        }
    });

    const slides = [
        {
            id: 1,
            title: "Accessories that move with them",
            subtitle: "Practical, comfortable accessories for pets",
            image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=600&fit=crop",
            cta: "Shop now"
        },
        {
            id: 2,
            title: "Where Paws Meet Plush",
            subtitle: "Premium quality for your furry friends",
            image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1200&h=600&fit=crop",
            cta: "Explore Collection"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    useEffect(() => {
        if (activeDiscounts.length > 1) {
            const timer = setInterval(() => {
                setCurrentDiscountIndex((prev) => (prev + 1) % activeDiscounts.length);
            }, 5000); 
            return () => clearInterval(timer);
        }
    }, [activeDiscounts.length]);

    const activeDiscount = activeDiscounts[currentDiscountIndex];

    return (
        <div className="relative w-full overflow-hidden">
            {/* Announcement Banner (Static Display, silently rotates) */}
            {activeDiscounts.length > 0 && activeDiscount && (
                <div className="bg-plum py-2 text-center text-white text-sm font-sans relative z-10 transition-opacity duration-500 ease-in-out">
                    <span className="font-medium">
                        Special Offer! Get {activeDiscount.type === 'percentage' ? `${activeDiscount.value}%` : `₹${(activeDiscount.value / 100).toFixed(2)}`} OFF with code 
                    </span>
                    <span className="inline-block mx-2 px-3 py-0.5 bg-gold text-plum font-bold rounded-full text-xs">
                        {activeDiscount.code}
                    </span>
                    {activeDiscount.minOrderValue > 0 && (
                        <span className="text-white/80 text-xs">
                            (Min. order: ₹{(activeDiscount.minOrderValue / 100).toFixed(2)})
                        </span>
                    )}
                </div>
            )}

            {/* Hero Section */}
            <div className="relative min-h-[500px] md:min-h-[600px] overflow-hidden flex items-center">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center ${index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-plum/80 to-plum/40" />
                        </div>

                        {/* Content */}
                        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="max-w-2xl text-white">
                                <div className="text-gold text-sm tracking-[0.2em] font-semibold uppercase mb-4 font-sans">
                                    Premium Pet Accessories
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] font-serif">
                                    {slide.title}
                                </h1>
                                <p className="text-lg md:text-xl mb-10 text-cream/90 font-sans max-w-xl">
                                    {slide.subtitle}
                                </p>
                                <button
                                    onClick={onShopNow}
                                    className="inline-block px-10 py-4 bg-gold hover:bg-[#b89d5a] text-plum text-base md:text-lg font-bold rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-xl shadow-plum/20"
                                >
                                    {slide.cta}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
