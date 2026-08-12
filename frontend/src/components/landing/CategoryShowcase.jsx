import { Link } from 'react-router-dom';
import { filterProducts } from '@/data/products.js';

export default function CategoryShowcase() {
    const categoriesData = [
        { name: 'Velvet Collars', image: '/categories/collars.png' },
        { name: 'Velvet Leashes', image: '/categories/leashes.png' },
        { name: 'Velvet Harness Sets', image: '/categories/harnessSets.png' },
        { name: 'Little Paws Harnesses Sets', image: '/categories/lpHarnessSets.png' },
        { name: 'Night Walk Sets', image: '/categories/nightWalkSets.png' },
        { name: 'Velvet Accessories', image: '/categories/accessories.png' },
        { name: 'Playtime Essentials', image: '/categories/playtimeEssentials.png' },
    ];

    const categoriesWithCount = categoriesData.map(cat => ({
        ...cat,
        count: filterProducts({ category: cat.name }).length
    }));

    return (
        <div className="py-16 lg:py-24 bg-cream">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-serif text-plum mb-4">
                        Shop by Category
                    </h2>
                    <p className="text-charcoal/70 font-sans max-w-2xl mx-auto">
                        Explore our premium collection of accessories designed for comfort and style.
                    </p>
                </div>

                {/* Grid */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                    {categoriesWithCount.map((category, index) => (
                        <Link
                            key={category.name}
                            to={`/products?category=${encodeURIComponent(category.name)}`}
                            className="w-[calc(50%-8px)] sm:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] group bg-white border border-blush/40 rounded-2xl p-3 sm:p-4 block transition-all duration-300 hover:shadow-lg hover:border-plum/40 animate-fade-in-slide-up"
                            style={{ animationDelay: `${index * 40}ms` }}
                        >
                            {/* Aspect Ratio Container */}
                            <div className="relative aspect-square w-full bg-cream rounded-xl overflow-hidden mb-4">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                            
                            {/* Text Content */}
                            <div className="text-center px-1">
                                <h3 className="font-serif font-bold text-plum text-base sm:text-lg leading-tight mb-1 group-hover:text-gold transition-colors">
                                    {category.name}
                                </h3>
                                <p className="font-sans text-xs sm:text-sm text-charcoal/60 font-medium">
                                    {category.count} Products
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
