import { Truck, ShieldCheck, RotateCcw, Star, Sparkles } from 'lucide-react';

export default function TrustBadges() {
    const badges = [
        {
            title: "Free Shipping",
            subtitle: "On orders above ₹999",
            icon: <Truck className="w-6 h-6 text-plum" strokeWidth={1.5} />,
        },
        {
            title: "Secure Payment",
            subtitle: "100% safe checkout",
            icon: <ShieldCheck className="w-6 h-6 text-plum" strokeWidth={1.5} />,
        },
        {
            title: "Easy Returns",
            subtitle: "15-day return policy",
            icon: <RotateCcw className="w-6 h-6 text-plum" strokeWidth={1.5} />,
        },
        {
            title: "Premium Quality",
            subtitle: "Crafted with care",
            icon: <Star className="w-6 h-6 text-plum" strokeWidth={1.5} />,
        },
        {
            title: "New Arrivals",
            subtitle: "Updated weekly",
            icon: <Sparkles className="w-6 h-6 text-plum" strokeWidth={1.5} />,
        }
    ];

    return (
        <div className="bg-white py-12 border-b border-blush/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {badges.map((badge, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-full bg-blush/40 flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-blush shadow-sm">
                                {badge.icon}
                            </div>
                            <h4 className="text-charcoal font-sans font-bold text-sm mb-1">
                                {badge.title}
                            </h4>
                            <p className="text-charcoal/60 font-sans text-xs">
                                {badge.subtitle}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
