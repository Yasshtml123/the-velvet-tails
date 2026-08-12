import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, ShoppingCart, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { addToCart } from '@/features/cartSlice.js';
import { formatPrice } from '@/utils/formatters.js';
import { optimizeCloudinaryUrl } from '@/utils/cloudinary.js';

// ─── Stable mock helpers (deterministic, no randomness) ───────────────────────
function getMockRating(title = '') {
  return (4.0 + (title.length % 10) / 10).toFixed(1);
}
function getMockReviewCount(title = '') {
  return 10 + (title.length % 50);
}

// ─── Skeleton card — only shown on first cold-load ────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[220px] sm:w-[240px] md:w-[260px]">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-blush/30">
        <div className="aspect-square bg-blush/30 animate-pulse" />
        <div className="p-4 space-y-2.5">
          <div className="w-16 h-2.5 bg-blush rounded-full animate-pulse" />
          <div className="w-full h-4 bg-blush/70 rounded animate-pulse" />
          <div className="w-3/4 h-4 bg-blush/50 rounded animate-pulse" />
          <div className="flex gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-blush/40 rounded-sm animate-pulse" />
            ))}
          </div>
          <div className="w-20 h-5 bg-blush/60 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ─── Single product card ───────────────────────────────────────────────────────
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
  const filledStars = Math.round(parseFloat(rating));

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
    setTimeout(() => setAddedFlash(false), 1600);
  };

  return (
    <div
      className="flex-shrink-0 w-[220px] sm:w-[240px] md:w-[260px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden border border-blush/30 transition-all duration-300"
        style={{
          boxShadow: isHovered
            ? '0 20px 40px -8px rgba(92,57,117,0.25), 0 0 0 2px rgba(203,178,106,0.4)'
            : '0 2px 12px -2px rgba(0,0,0,0.07), 0 0 0 1px rgba(232,213,196,0.5)',
          transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        }}
      >
        {/* ── Image ── */}
        <Link to={`/products/${product._id}`} className="block relative overflow-hidden">
          <div className="aspect-square bg-cream relative">

            {/* Spinner while image loads */}
            {!imageLoaded && imgSrc && (
              <div className="absolute inset-0 flex items-center justify-center bg-cream">
                <div className="w-8 h-8 border-2 border-plum/20 border-t-plum rounded-full animate-spin" />
              </div>
            )}

            {imgSrc ? (
              <img
                src={imgSrc}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500"
                style={{
                  opacity: imageLoaded ? 1 : 0,
                  transform: isHovered ? 'scale(1.07)' : 'scale(1)',
                  transition: 'opacity 0.3s, transform 0.5s',
                }}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
              />
            ) : (
              /* No-image placeholder */
              <div className="flex flex-col items-center justify-center h-full gap-2 text-charcoal/20">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-sans">No image</span>
              </div>
            )}

            {/* Discount badge */}
            {discountPct > 0 && (
              <div className="absolute top-2.5 left-2.5 z-10 bg-sage text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                -{discountPct}%
              </div>
            )}

            {/* Out-of-stock overlay */}
            {product.inventory === 0 && (
              <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-[2px] flex items-center justify-center z-10">
                <span className="bg-white/90 text-charcoal font-bold text-xs px-3 py-1.5 rounded-lg shadow">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Quick Add — slides up on hover */}
            {product.inventory > 0 && (
              <div
                className="absolute bottom-0 left-0 right-0 p-2.5 z-10 transition-all duration-300"
                style={{
                  transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
                  opacity: isHovered ? 1 : 0,
                }}
              >
                <button
                  onClick={handleQuickAdd}
                  className={`w-full py-2.5 font-sans font-semibold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-colors duration-200 active:scale-95 ${
                    addedFlash
                      ? 'bg-sage text-white'
                      : 'bg-plum hover:bg-plum/90 text-white'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {addedFlash ? '✓ Added to cart!' : 'Quick Add'}
                </button>
              </div>
            )}
          </div>
        </Link>

        {/* ── Info ── */}
        <div className="p-4">
          {/* Category pill */}
          <span
            className="inline-block px-2.5 py-0.5 text-plum text-[10px] font-semibold rounded-full mb-2"
            style={{ background: 'rgba(92,57,117,0.08)' }}
          >
            {product.category}
          </span>

          {/* Title */}
          <Link to={`/products/${product._id}`}>
            <h3 className="font-sans font-semibold text-charcoal text-sm leading-snug line-clamp-2 mb-2 hover:text-plum transition-colors duration-150">
              {product.title}
            </h3>
          </Link>

          {/* Star rating */}
          <div className="flex items-center gap-1 mb-2.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < filledStars ? 'text-gold fill-gold' : 'text-gray-200 fill-gray-200'}`}
              />
            ))}
            <span className="text-[10px] font-sans text-charcoal/45 ml-0.5">({reviewCount})</span>
          </div>

          {/* Price row */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-charcoal font-sans text-base">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-charcoal/35 line-through font-sans">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main section ──────────────────────────────────────────────────────────────
// products & isLoading come from the parent (ProductList) which owns the fetch.
// showSkeleton is ONLY driven by products being empty — not by isLoading —
// so re-fetches in the background never flash skeletons over loaded data.
export default function NewArrivalsGrid({ products = [], isLoading = false, onBrowseAll }) {
  const [scrollIndex, setScrollIndex] = useState(0);

  const newArrivals = [...products]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 8);

  // KEY FIX: only show skeleton when we have zero products AND are loading.
  // Once products arrive they stay rendered — never replaced by skeletons again.
  const showSkeleton = newArrivals.length === 0 && isLoading;
  // If products are 0 and NOT loading, the store returned empty — still show section.
  const isEmpty = newArrivals.length === 0 && !isLoading;

  const CARD_WIDTH = 276; // px — w-[260px] + gap-4 (16px)
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
            <p className="font-sans text-xs font-bold text-gold uppercase tracking-[0.22em] mb-2">
              ✦ Fresh In
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-plum leading-tight">
              New Arrivals
            </h2>
            <p className="text-charcoal/55 font-sans text-sm mt-1.5">
              Fresh styles for your furry friends
            </p>
          </div>

          {/* Nav arrows + View All — always visible (disabled when skeleton) */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={!canPrev || showSkeleton}
              aria-label="Scroll left"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canPrev && !showSkeleton
                  ? 'border-plum/30 text-plum hover:bg-plum hover:text-white hover:border-plum'
                  : 'border-blush/50 text-charcoal/20 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={!canNext || showSkeleton}
              aria-label="Scroll right"
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canNext && !showSkeleton
                  ? 'border-plum/30 text-plum hover:bg-plum hover:text-white hover:border-plum'
                  : 'border-blush/50 text-charcoal/20 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onBrowseAll}
              className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-plum hover:text-gold transition-colors duration-200 ml-3"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Cards ── */}
        <div className="overflow-hidden">
          {showSkeleton ? (
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : isEmpty ? (
            /* API returned 0 products — prompt user to browse */
            <div className="py-12 text-center">
              <p className="font-sans text-charcoal/50 text-sm mb-4">Products are loading…</p>
              <button
                onClick={onBrowseAll}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-plum text-white font-sans font-semibold text-sm rounded-full hover:bg-plum/90 transition-all active:scale-95"
              >
                Browse All Products <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              className="flex gap-4 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(calc(-${scrollIndex} * ${CARD_WIDTH}px))` }}
            >
              {newArrivals.map((product) => (
                <NewArrivalCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Mobile View All */}
        {!showSkeleton && !isEmpty && (
          <div className="mt-8 text-center md:hidden">
            <button
              onClick={onBrowseAll}
              className="inline-flex items-center gap-2 px-7 py-3 bg-plum hover:bg-plum/90 text-white font-sans font-bold text-sm rounded-full transition-all active:scale-95 shadow-lg shadow-plum/20"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Decorative divider */}
        <div className="mt-12 flex items-center gap-3">
          <div className="flex-1 h-px bg-blush/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold" />
          <div className="flex-1 h-px bg-blush/50" />
        </div>
      </div>
    </section>
  );
}
