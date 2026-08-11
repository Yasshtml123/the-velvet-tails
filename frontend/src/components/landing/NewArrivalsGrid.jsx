import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, ShoppingCart, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { addToCart } from '@/features/cartSlice.js';
import { formatPrice } from '@/utils/formatters.js';
import { optimizeCloudinaryUrl } from '@/utils/cloudinary.js';

// Derive a stable mock rating from the product title length
function getMockRating(title = '') {
  return (4.0 + (title.length % 10) / 10).toFixed(1);
}
function getMockReviewCount(title = '') {
  return 10 + (title.length % 50);
}

// Single mini-card inside the grid
function NewArrivalCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addedFlash, setAddedFlash] = useState(false);

  const rawUrl = product.images?.[0]?.url || product.images?.[0] || null;
  const imgSrc = optimizeCloudinaryUrl(rawUrl, 500);

  const discountPct =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : 0;

  const rating = getMockRating(product.title);
  const reviewCount = getMockReviewCount(product.title);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login', { state: { from: `/products/${product._id}` } });
      return;
    }
    if (product.inventory === 0) return;
    dispatch(addToCart({ product, quantity: 1 }));
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1500);
  };

  return (
    <div
      className="flex-shrink-0 w-52 sm:w-56 md:w-60 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden transition-all duration-400 ease-out"
        style={{
          boxShadow: isHovered
            ? '0 20px 40px -8px rgba(92,57,117,0.28), 0 0 0 2px rgba(203,178,106,0.35)'
            : '0 2px 12px -2px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
          transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        }}
      >
        {/* Image */}
        <Link to={`/products/${product._id}`} className="block relative overflow-hidden">
          <div className="aspect-square bg-cream">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-plum/20 border-t-plum rounded-full animate-spin" />
              </div>
            )}
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={product.title}
                className={`w-full h-full object-cover transition-transform duration-600 ease-out ${
                  isHovered ? 'scale-108' : 'scale-100'
                } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-charcoal/20">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Discount badge */}
            {discountPct > 0 && (
              <div className="absolute top-2.5 left-2.5 bg-sage text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                -{discountPct}%
              </div>
            )}

            {/* Out of stock overlay */}
            {product.inventory === 0 && (
              <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-white/90 text-charcoal font-bold text-xs px-3 py-1.5 rounded-lg shadow">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Quick Add — slides up on hover */}
            {product.inventory > 0 && (
              <div
                className={`absolute bottom-0 left-0 right-0 p-2.5 transition-all duration-300 ${
                  isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
              >
                <button
                  onClick={handleQuickAdd}
                  className={`w-full py-2.5 font-sans font-semibold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 ${
                    addedFlash
                      ? 'bg-sage text-white'
                      : 'bg-plum hover:bg-plum/90 text-white'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {addedFlash ? 'Added!' : 'Quick Add'}
                </button>
              </div>
            )}
          </div>
        </Link>

        {/* Info */}
        <div className="p-3.5">
          {/* Category pill */}
          <span className="inline-block px-2 py-0.5 bg-plum/8 text-plum text-[10px] font-semibold rounded-full mb-1.5"
            style={{ background: 'rgba(92,57,117,0.08)' }}>
            {product.category}
          </span>

          {/* Title */}
          <Link to={`/products/${product._id}`}>
            <h3 className="font-sans font-semibold text-charcoal text-sm leading-snug line-clamp-2 mb-1.5 hover:text-plum transition-colors duration-150">
              {product.title}
            </h3>
          </Link>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.round(parseFloat(rating)) ? 'text-gold fill-gold' : 'text-gray-200'}`}
              />
            ))}
            <span className="text-[10px] font-sans text-charcoal/50 ml-0.5">({reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-charcoal font-sans text-base">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-charcoal/40 line-through font-sans">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main New Arrivals section ────────────────────────────────────────────────
export default function NewArrivalsGrid({ products = [], onBrowseAll }) {
  const [scrollIndex, setScrollIndex] = useState(0);

  // Show up to 8 newest items; fall back to first 8 by index
  const newArrivals = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  if (newArrivals.length === 0) return null;

  const canPrev = scrollIndex > 0;
  const canNext = scrollIndex < newArrivals.length - 1;

  const handlePrev = () => setScrollIndex((i) => Math.max(0, i - 2));
  const handleNext = () => setScrollIndex((i) => Math.min(newArrivals.length - 1, i + 2));

  return (
    <section className="py-14 lg:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="flex items-end justify-between mb-8">
          <div>
            {/* Eyebrow */}
            <p className="font-sans text-xs font-bold text-gold uppercase tracking-[0.22em] mb-2">
              ✦ Fresh In
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-plum leading-tight">
              New Arrivals
            </h2>
            <p className="text-charcoal/60 font-sans text-sm mt-1.5">
              Fresh styles for your furry friends
            </p>
          </div>

          {/* Desktop: View All link + nav arrows */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={!canPrev}
              aria-label="Scroll left"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canPrev
                  ? 'border-plum/30 text-plum hover:bg-plum hover:text-white hover:border-plum'
                  : 'border-blush text-charcoal/20 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={!canNext}
              aria-label="Scroll right"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canNext
                  ? 'border-plum/30 text-plum hover:bg-plum hover:text-white hover:border-plum'
                  : 'border-blush text-charcoal/20 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onBrowseAll}
              className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-plum hover:text-gold transition-colors duration-200 ml-2"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Cards row — horizontally scrollable on mobile ── */}
        <div className="overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(calc(-${scrollIndex} * (${
                typeof window !== 'undefined' && window.innerWidth < 640 ? '224px' : '248px'
              } + 16px)))`,
            }}
          >
            {newArrivals.map((product) => (
              <NewArrivalCard key={product._id} product={product} />
            ))}
          </div>
        </div>

        {/* ── Mobile: View All CTA ── */}
        <div className="mt-8 text-center md:hidden">
          <button
            onClick={onBrowseAll}
            className="inline-flex items-center gap-2 px-7 py-3 bg-plum hover:bg-plum/90 text-white font-sans font-bold text-sm rounded-full transition-all active:scale-95 shadow-lg shadow-plum/20"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* ── Gold divider ── */}
        <div className="mt-12 flex items-center gap-3">
          <div className="flex-1 h-px bg-blush/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold" />
          <div className="flex-1 h-px bg-blush/60" />
        </div>
      </div>
    </section>
  );
}
