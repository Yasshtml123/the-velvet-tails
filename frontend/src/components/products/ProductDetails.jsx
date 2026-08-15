import { useState, useEffect } from 'react';
import api from '@/services/api.js';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { findProduct, PRODUCTS } from '@/data/products.js';
import { addToCart } from '@/features/cartSlice.js';
import ImageGallery from './ImageGallery.jsx';
import ProductCard from './ProductCard.jsx';
import { formatPrice } from '@/utils/formatters.js';
import { 
    Star, Heart, Share2, ShieldCheck, Truck, RefreshCcw, 
    CheckCircle, ChevronDown, ChevronUp, ThumbsUp, Check, 
    MessageCircle, Link2, ShoppingBag, X, Send, Quote, Trash2 
} from 'lucide-react';

// ─── Interactive star-picker used inside the form ─────────────────────────────
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none transition-transform duration-100 hover:scale-110 active:scale-95"
        >
          <Star
            className={`w-7 h-7 transition-colors duration-150 ${
              star <= (hovered || value)
                ? 'text-gold fill-gold'
                : 'text-white/40'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ── currentProduct must be looked up FIRST so initial useState values are correct ──
    const currentProduct = findProduct(id);

    const { user } = useSelector((state) => state.auth || {});
    const isAdmin = user?.role === 'admin';

    // ── All hooks MUST be declared unconditionally before any early returns ──────
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(currentProduct?.size || 'Small');
    const [selectedColor, setSelectedColor] = useState(currentProduct?.color || '');
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Sync UI state when navigating between variants (same component, different :id)
    useEffect(() => {
        if (currentProduct) {
            setSelectedSize(currentProduct.size || 'Small');
            setSelectedColor(currentProduct.color || '');
            setActiveImageIndex(0);
        }
    }, [currentProduct?._id]);

    // Accordion states
    const [openAccordion, setOpenAccordion] = useState('description');

    // Review Modal states
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewForm, setReviewForm] = useState({ name: '', pet: '', rating: 5, text: '' });
    const [submitted, setSubmitted] = useState(false);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Reviews state — must live here (before early return) to satisfy Rules of Hooks
    const [localReviews, setLocalReviews] = useState([]);

    // ── Fetch reviews from Express API on mount ───────────────────────────────
    useEffect(() => {
        if (!currentProduct?._id) return;

        setReviewsLoading(true);
        api.get(`/reviews/product/${currentProduct._id}`)
            .then(({ data }) => {
                setLocalReviews(data.reviews || []);
            })
            .catch((err) => {
                console.error('Failed to fetch reviews:', err);
            })
            .finally(() => {
                setReviewsLoading(false);
            });
    }, [currentProduct?._id]);

    // ── Handler functions ────────────────────────────────────────────────────
    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) return;
        if (currentProduct && newQuantity > currentProduct.inventory) {
            alert(`Only ${currentProduct.inventory} items available`);
            return;
        }
        setQuantity(newQuantity);
    };

    const handleAddToCart = () => {
        if (!activeVariant || !activeVariant?._id) return;
        dispatch(addToCart({ product: activeVariant, quantity }));
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/checkout');
    };

    const toggleAccordion = (section) => {
        setOpenAccordion(openAccordion === section ? null : section);
    };

    const closeForm = () => {
        setShowReviewModal(false);
        setTimeout(() => {
            setSubmitted(false);
            setSubmitError(null);
            setReviewForm({ name: '', pet: '', rating: 5, text: '' });
        }, 300);
    };

    // ── Submit review to MongoDB via Express API ───────────────────────────────
    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        // Ensure user is logged in
        if (!user) {
            setSubmitError('You must be logged in to submit a review.');
            return;
        }

        if (!reviewForm.text.trim()) return;
        setSubmitError(null);

        try {
            const { data } = await api.post('/reviews', {
                productId: currentProduct._id,
                rating: Number(reviewForm.rating),
                comment: reviewForm.text.trim(),
                petName: reviewForm.pet?.trim() || ''
            });

            // Prepend the returned review to the list
            setLocalReviews([data.review, ...localReviews]);
            setSubmitted(true);

            // Auto close after 3s
            setTimeout(() => {
                closeForm();
            }, 3000);

        } catch (error) {
            console.error('Review submit error:', error);
            setSubmitError(error.response?.data?.message || 'Failed to submit your review. Please try again.');
        }
    };

    const handleDeleteReview = (id) => {
        setLocalReviews((prev) => prev.filter((r) => r.id !== id));
    };

    // ── Early return AFTER all hooks ─────────────────────────────────────────
    if (!currentProduct) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h1 className="text-3xl font-bold font-serif text-charcoal mb-4">Product Not Found</h1>
                <p className="text-charcoal/60 font-sans mb-8">The product you're looking for doesn't exist.</p>
                <button
                    onClick={() => navigate('/products')}
                    className="px-6 py-3 bg-plum text-white rounded-full hover:bg-plum/90 font-sans font-medium transition-colors"
                >
                    Back to Products
                </button>
            </div>
        );
    }

    // ── Derive sibling variants from PRODUCTS (same base title root) ─────────
    const getBaseName = (title) => title?.split(/\s[—–-]\s/)[0]?.trim() || title;
    const baseProductName = getBaseName(currentProduct.title);

    const siblingVariants = PRODUCTS.filter(
        p => getBaseName(p.title) === baseProductName
    );

    // Available colors and size objects from actual sibling variants
    const availableColors = [...new Set(siblingVariants.map(p => p.color).filter(Boolean))];
    const availableSizes = [...new Set(siblingVariants.map(p => p.size).filter(Boolean))].map(sizeName => {
        const variantForSize = siblingVariants.find(p => p.size === sizeName && p.color === selectedColor) 
                            || siblingVariants.find(p => p.size === sizeName);
        return {
            size: sizeName,
            price: variantForSize ? variantForSize.price : currentProduct.price
        };
    });

    const COLOR_HEX_MAP = {
        'Red': '#E3342F', 'Brown': '#8B4513', 'Black': '#000000',
        'Orange': '#F6993F', 'Blue': '#3490DC', 'Gold': '#CBB26A',
        'Plum': '#5C3975', 'Charcoal': '#1A1A2E', 'Purple': '#5C3975',
        'Beige': '#F5F5DC', 'White': '#FFFFFF', 'Green': '#4CAF50',
        'Yellow': '#FFD700',
        'Desert Khaki': '#C3B091',
        'Ranger Green': '#4A5D23',
        'Natural Sand': '#C2B280',
        'Floral Carnival': 'linear-gradient(45deg, #FFB6C1, #FF69B4)',
        'Midnight Bloom': 'linear-gradient(45deg, #191970, #483D8B)',
        'Spring Blossom': 'linear-gradient(45deg, #FFB7C5, #98FF98)'
    };

    // Find the currently displayed variant based on selected color + size
    const activeVariant = siblingVariants.find(
        p => p.color === selectedColor && p.size === selectedSize
    ) || siblingVariants.find(
        p => p.color === selectedColor
    ) || currentProduct;

    // ── Color selection: navigate to the matched color+currentSize variant ────
    const handleColorSelect = (color) => {
        setSelectedColor(color);
        setActiveImageIndex(0);
        const target = siblingVariants.find(p => p.color === color && p.size === selectedSize)
            || siblingVariants.find(p => p.color === color);
        if (target && target._id !== currentProduct._id) {
            navigate(`/products/${target._id}`);
        }
    };

    // ── Size selection: navigate to the matched size+currentColor variant ────
    const handleSizeSelect = (size) => {
        setSelectedSize(size);
        const target = siblingVariants.find(p => p.size === size && p.color === selectedColor)
            || siblingVariants.find(p => p.size === size);
        if (target && target._id !== currentProduct._id) {
            navigate(`/products/${target._id}`);
        }
    };

    const descriptionPoints = currentProduct.description?.split('. ').filter(Boolean) || [];

    // Pricing: use the active variant's actual price from the catalog
    const currentDynamicPrice = activeVariant?.price || currentProduct?.price || 0;
    const currentDynamicComparePrice = activeVariant?.compareAtPrice || currentProduct?.compareAtPrice || null;

    const discountPercentage = currentDynamicComparePrice && currentDynamicComparePrice > currentDynamicPrice
        ? Math.round((1 - currentDynamicPrice / currentDynamicComparePrice) * 100)
        : 0;

    const reviewCount = localReviews.length;
    const rating = reviewCount > 0 
        ? (localReviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount).toFixed(1)
        : 0;
    
    // Recommend Products: Just pick 4 products from same category or random
    const recommendedProducts = PRODUCTS.filter(p => p.category === currentProduct.category && p._id !== currentProduct._id).slice(0, 4);
    if (recommendedProducts.length < 4) {
        // pad with others
        const others = PRODUCTS.filter(p => p._id !== currentProduct._id && !recommendedProducts.find(r => r._id === p._id)).slice(0, 4 - recommendedProducts.length);
        recommendedProducts.push(...others);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 bg-white min-h-screen">
            {/* Breadcrumbs */}
            <nav className="flex mb-6 text-sm font-sans items-center">
                <Link to="/" className="text-charcoal/60 hover:text-plum transition-colors">Home</Link>
                <span className="mx-2 text-charcoal/40">/</span>
                <Link to="/products" className="text-charcoal/60 hover:text-plum transition-colors">Products</Link>
                <span className="mx-2 text-charcoal/40">/</span>
                <span className="text-charcoal font-semibold truncate max-w-[200px] md:max-w-none">{currentProduct?.title || 'Product'}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
                {/* Image Gallery */}
                <div className="lg:col-span-7 relative">
                    <ImageGallery 
                        images={activeVariant?.images || currentProduct?.images || []} 
                        activeIndex={activeImageIndex} 
                        onIndexChange={setActiveImageIndex} 
                    />
                </div>

                {/* Product Info */}
                <div className="lg:col-span-5 flex flex-col space-y-6">
                    {/* Header & Pricing */}
                    <div className="border-b border-blush/40 pb-6">
                        <p className="text-sm font-sans font-bold text-sage uppercase tracking-wider mb-2">{currentProduct?.category}</p>
                        <h1 className="text-2xl md:text-3xl font-bold font-serif text-charcoal mb-3 leading-tight">{activeVariant?.title || currentProduct?.title}</h1>
                        
                        <div className="flex items-center gap-4 mb-4 flex-wrap">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-gold fill-gold' : 'text-gray-300'}`} />
                                ))}
                                <span className="text-sm font-bold text-charcoal ml-1">{rating}</span>
                                <a href="#reviews" className="text-sm text-plum hover:underline ml-1">({reviewCount} reviews)</a>
                            </div>
                            <div className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <CheckCircle className="w-3 h-3 mr-1" /> Verified Product
                            </div>
                        </div>

                        <div className="flex items-end gap-3 mb-2">
                            <span className="text-3xl font-bold font-sans text-plum">
                                {formatPrice(currentDynamicPrice)}
                            </span>
                            {currentDynamicComparePrice && currentDynamicComparePrice > currentDynamicPrice && (
                                <span className="text-lg text-charcoal/40 line-through mb-1">
                                    {formatPrice(currentDynamicComparePrice)}
                                </span>
                            )}
                            {discountPercentage > 0 && (
                                <span className="bg-sage text-white text-xs font-bold px-2 py-1 rounded mb-1.5 ml-2">
                                    Save {discountPercentage}%
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Variants & Stock */}
                    {!isAdmin && (
                        <div className="space-y-6 pb-6 border-b border-blush/40">
                            <div>
                                <div className="flex justify-between mb-3">
                                    <h4 className="text-sm font-bold font-sans text-charcoal">Color: <span className="font-normal text-charcoal/70">{selectedColor}</span></h4>
                                </div>
                                <div className="flex gap-3 flex-wrap">
                                    {availableColors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => handleColorSelect(color)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all relative ${selectedColor === color ? 'ring-2 ring-offset-2 ring-plum scale-110' : 'hover:scale-110 ring-1 ring-gray-200'}`}
                                            style={{ background: COLOR_HEX_MAP[color] || '#888' }}
                                            aria-label={`Select color ${color}`}
                                            title={color}
                                        >
                                            {selectedColor === color && (
                                                <Check className={`w-4 h-4 ${color === 'White' || color === 'Gold' || color === 'Beige' ? 'text-charcoal' : 'text-white'}`} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-3">
                                    <h4 className="text-sm font-bold font-sans text-charcoal">Size: <span className="font-normal text-charcoal/70">{selectedSize}</span></h4>
                                    <button className="text-sm font-medium text-plum hover:underline flex items-center">
                                        Size Guide
                                    </button>
                                </div>
                                <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(availableSizes.length, 4)}, 1fr)` }}>
                                    {availableSizes.map(sizeObj => {
                                        return (
                                            <button
                                                key={sizeObj.size}
                                                onClick={() => handleSizeSelect(sizeObj.size)}
                                                className={`py-2.5 border rounded-lg font-sans font-semibold text-sm transition-all ${selectedSize === sizeObj.size
                                                        ? 'border-plum bg-plum/5 text-plum ring-1 ring-plum'
                                                        : 'border-gray-200 bg-white text-charcoal/70 hover:border-plum/50 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <span className="block">{sizeObj.size}</span>
                                                <span className="text-[10px] font-normal opacity-70">{formatPrice(sizeObj.price)}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Stock Indicator */}
                            <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${currentProduct.inventory > 10 ? 'bg-green-500' : currentProduct.inventory > 0 ? 'bg-orange-500 animate-pulse' : 'bg-red-500'}`}></div>
                                <span className={`text-sm font-medium ${currentProduct.inventory > 10 ? 'text-green-700' : currentProduct.inventory > 0 ? 'text-orange-700' : 'text-red-700'}`}>
                                    {currentProduct.inventory > 10 ? 'In Stock — Ready to Ship' : currentProduct.inventory > 0 ? `Only ${currentProduct.inventory} left in stock - Order soon` : 'Out of Stock'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons & Sharing */}
                    <div className="space-y-4 pt-2">
                        <div className="flex gap-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-12 w-32 shrink-0">
                                <button onClick={() => handleQuantityChange(quantity - 1)} className="px-3 text-charcoal/60 hover:text-plum font-bold text-lg flex-1 h-full flex items-center justify-center">-</button>
                                <input type="number" value={quantity} onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)} className="w-10 text-center font-sans font-semibold text-charcoal bg-transparent focus:outline-none" />
                                <button onClick={() => handleQuantityChange(quantity + 1)} className="px-3 text-charcoal/60 hover:text-plum font-bold text-lg flex-1 h-full flex items-center justify-center">+</button>
                            </div>
                            
                            {/* Add to Cart Button */}
                            <button 
                                onClick={handleAddToCart} 
                                disabled={currentProduct.inventory === 0}
                                className="flex-1 h-12 bg-white border-2 border-plum text-plum hover:bg-plum/5 font-sans font-bold text-sm lg:text-base rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                Add to Cart
                            </button>
                        </div>
                        
                        <div className="flex gap-4">
                            {/* Buy Now Button */}
                            <button 
                                onClick={handleBuyNow}
                                disabled={currentProduct.inventory === 0}
                                className="flex-1 h-12 bg-plum hover:bg-plum/90 text-white font-sans font-bold text-base rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Buy It Now
                            </button>
                            
                            {/* Wishlist Button */}
                            <button className="w-12 h-12 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-charcoal/60 hover:text-red-500 transition-colors shrink-0">
                                <Heart className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Social Sharing */}
                        <div className="flex items-center justify-center gap-4 pt-4 text-charcoal/50">
                            <span className="text-xs font-semibold uppercase tracking-widest mr-2">Share:</span>
                            <button className="hover:text-blue-600 transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </button>
                            <button className="hover:text-blue-400 transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                            </button>
                            <button className="hover:text-green-500 transition-colors"><MessageCircle className="w-4 h-4" /></button>
                            <button className="hover:text-charcoal transition-colors"><Link2 className="w-4 h-4" /></button>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-2 py-4 bg-gray-50 rounded-xl px-4 mt-6">
                        <div className="flex flex-col items-center justify-center text-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-sage" />
                            <span className="text-[10px] sm:text-xs font-medium text-charcoal/80 leading-tight">Secure<br/>Checkout</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center gap-2 border-x border-gray-200">
                            <Truck className="w-6 h-6 text-sage" />
                            <span className="text-[10px] sm:text-xs font-medium text-charcoal/80 leading-tight">Free<br/>Shipping</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center gap-2">
                            <RefreshCcw className="w-6 h-6 text-sage" />
                            <span className="text-[10px] sm:text-xs font-medium text-charcoal/80 leading-tight">Easy<br/>Returns</span>
                        </div>
                    </div>

                    {/* Accordions */}
                    <div className="mt-8 border-t border-gray-200">
                        {/* Description */}
                        <div className="border-b border-gray-200">
                            <button 
                                onClick={() => toggleAccordion('description')} 
                                className="w-full py-4 flex justify-between items-center text-left focus:outline-none"
                            >
                                <span className="font-bold font-serif text-charcoal">Description</span>
                                {openAccordion === 'description' ? <ChevronUp className="w-5 h-5 text-charcoal/50" /> : <ChevronDown className="w-5 h-5 text-charcoal/50" />}
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === 'description' ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                                <ul className="space-y-2">
                                    {descriptionPoints.map((point, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold mt-2 mr-3 flex-shrink-0"></span>
                                            <span className="text-charcoal/80 font-sans text-sm leading-relaxed">{point}{!point.endsWith('.') ? '.' : ''}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Specifications */}
                        <div className="border-b border-gray-200">
                            <button 
                                onClick={() => toggleAccordion('specs')} 
                                className="w-full py-4 flex justify-between items-center text-left focus:outline-none"
                            >
                                <span className="font-bold font-serif text-charcoal">Specifications</span>
                                {openAccordion === 'specs' ? <ChevronUp className="w-5 h-5 text-charcoal/50" /> : <ChevronDown className="w-5 h-5 text-charcoal/50" />}
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === 'specs' ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                                <div className="text-sm text-charcoal/80 font-sans grid grid-cols-2 gap-4">
                                    <div className="font-medium">Material:</div>
                                    <div>{currentProduct.material || 'Premium Velvet & Vegan Leather'}</div>
                                    <div className="font-medium">Dimensions:</div>
                                    <div>{currentProduct.dimensions ? `${currentProduct.dimensions.length} x ${currentProduct.dimensions.breadth} x ${currentProduct.dimensions.height} cm` : 'Standard'}</div>
                                    <div className="font-medium">Weight:</div>
                                    <div>{currentProduct.dimensions ? `${currentProduct.dimensions.weight} kg` : '0.2 kg'}</div>
                                    <div className="font-medium">SKU:</div>
                                    <div className="uppercase">{currentProduct._id?.substring(0,8)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Care Instructions */}
                        <div className="border-b border-gray-200">
                            <button 
                                onClick={() => toggleAccordion('care')} 
                                className="w-full py-4 flex justify-between items-center text-left focus:outline-none"
                            >
                                <span className="font-bold font-serif text-charcoal">Care Instructions</span>
                                {openAccordion === 'care' ? <ChevronUp className="w-5 h-5 text-charcoal/50" /> : <ChevronDown className="w-5 h-5 text-charcoal/50" />}
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === 'care' ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                                <p className="text-sm text-charcoal/80 font-sans leading-relaxed">
                                    Hand wash in cold water with mild detergent. Do not bleach. Lay flat to dry out of direct sunlight. Do not iron or tumble dry. Wipe hardware with a soft, dry cloth.
                                </p>
                            </div>
                        </div>

                        {/* Shipping & Returns */}
                        <div className="border-b border-gray-200">
                            <button 
                                onClick={() => toggleAccordion('shipping')} 
                                className="w-full py-4 flex justify-between items-center text-left focus:outline-none"
                            >
                                <span className="font-bold font-serif text-charcoal">Shipping & Returns</span>
                                {openAccordion === 'shipping' ? <ChevronUp className="w-5 h-5 text-charcoal/50" /> : <ChevronDown className="w-5 h-5 text-charcoal/50" />}
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === 'shipping' ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                                <p className="text-sm text-charcoal/80 font-sans leading-relaxed mb-2">
                                    <strong className="text-charcoal font-semibold">Free Standard Shipping:</strong> 3-5 business days.
                                </p>
                                <p className="text-sm text-charcoal/80 font-sans leading-relaxed mb-2">
                                    <strong className="text-charcoal font-semibold">Express Shipping:</strong> 1-2 business days (Calculated at checkout).
                                </p>
                                <p className="text-sm text-charcoal/80 font-sans leading-relaxed">
                                    <strong className="text-charcoal font-semibold">Returns:</strong> We accept returns within 30 days of delivery. Items must be in original condition with tags attached.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Reviews Section */}
            <div id="reviews" className="mt-16 pt-16 border-t border-gray-200">
                <h2 className="text-2xl font-bold font-serif text-charcoal mb-8">Customer Reviews</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Review Summary */}
                    <div className="md:col-span-4">
                        <div className="flex items-center gap-4 mb-6">
                            <h3 className="text-5xl font-bold text-charcoal">{rating}</h3>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1 mb-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-gold fill-gold' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-charcoal/60">Based on {reviewCount} reviews</span>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            {[5, 4, 3, 2, 1].map(star => {
                                const count = localReviews.filter(r => r.rating === star).length;
                                const percentage = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
                                return (
                                    <div key={star} className="flex items-center gap-3 text-sm">
                                        <span className="w-12 font-medium text-charcoal">{star} Stars</span>
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-gold rounded-full" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <span className="w-8 text-right text-charcoal/60">{percentage}%</span>
                                    </div>
                                );
                            })}
                        </div>

                        <button 
                            onClick={() => setShowReviewModal(true)}
                            className="w-full py-3 border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white rounded-lg font-bold transition-colors">
                            Write a Review
                        </button>
                    </div>

                    {/* Review List */}
                    <div className="md:col-span-8 space-y-8">
                        {localReviews.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-charcoal/60 font-sans text-base mb-2">No reviews yet. Be the first to review this product!</p>
                            </div>
                        ) : (
                            localReviews.map(review => (
                                <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative group transition-all duration-300 hover:shadow-md">
                                    <Quote className="absolute top-6 right-6 w-8 h-8 text-plum/5" />
                                    
                                    {review.isUserSubmitted && (
                                        <button
                                            onClick={() => handleDeleteReview(review.id)}
                                            aria-label="Delete this review"
                                            title="Delete review"
                                            className="absolute top-3 left-3 w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all duration-200 shadow-sm"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                    
                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-gold fill-gold' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                    
                                    <p className="text-charcoal/80 font-sans leading-relaxed mb-6 pr-8">
                                        "{review.text}"
                                    </p>
                                    
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-plum text-white font-bold font-sans flex items-center justify-center text-sm shadow-sm">
                                                {review.avatar}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-charcoal text-sm">{review.author}</span>
                                                    {review.verified && (
                                                        <span className="flex items-center text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-semibold">
                                                            <CheckCircle className="w-3 h-3 mr-1" /> Verified
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-charcoal/50">
                                                    <span>{review.date}</span>
                                                    {review.pet && review.pet !== '—' && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="truncate max-w-[120px]">{review.pet}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {review.isUserSubmitted && (
                                                <span className="text-[10px] font-sans font-bold text-plum bg-plum/10 px-2 py-1 rounded-full hidden sm:block">
                                                    Your review
                                                </span>
                                            )}
                                            <button className="flex items-center gap-1 text-xs font-medium text-charcoal/40 hover:text-plum transition-colors">
                                                <ThumbsUp className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        
                        {localReviews.length > 0 && (
                            <div className="pt-4 text-center">
                                <button className="text-plum font-semibold hover:underline">Read All {reviewCount} Reviews</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recommended Products */}
            <div className="mt-20 pt-16 border-t border-gray-200">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-2xl font-bold font-serif text-charcoal">You May Also Like</h2>
                    <Link to="/products" className="text-sm font-semibold text-plum hover:underline hidden sm:block">View All</Link>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {recommendedProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>

            {/* Review Form Modal */}
            {showReviewModal && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                  role="dialog"
                  aria-modal="true"
                >
                  {/* Backdrop */}
                  <div
                    className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
                    onClick={closeForm}
                  />

                  {/* Modal panel */}
                  <div
                    className="relative w-full max-w-lg bg-plum rounded-3xl shadow-2xl overflow-hidden animate-fade-in-slide-up"
                  >
                    {/* Subtle dot-pattern texture */}
                    <div
                      className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '28px 28px',
                      }}
                    />

                    <div className="relative z-10 p-7 sm:p-8">
                      {/* Modal header */}
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold font-serif text-white">
                            Share Your Experience
                          </h3>
                          <p className="text-white/60 font-sans text-sm mt-1">
                            We'd love to hear about your experience with this product!
                          </p>
                        </div>
                        <button
                          onClick={closeForm}
                          aria-label="Close form"
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 flex-shrink-0 mt-0.5"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Success state */}
                      {submitted ? (
                        <div className="py-8 text-center animate-fade-in-slide-up">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center">
                            <Star className="w-8 h-8 text-gold fill-gold" />
                          </div>
                          <p className="text-white font-serif text-xl font-bold mb-1">Thank you!</p>
                          <p className="text-white/70 font-sans text-sm">Your review has been successfully submitted. 🐾</p>
                        </div>
                      ) : (
                        /* Form */
                        <form onSubmit={handleReviewSubmit} className="space-y-4" noValidate>
                          {/* Form Name field removed - Pulled from auth token */}

                          {/* Pet Details */}
                          <div>
                            <label className="block text-white/80 font-sans text-xs font-semibold uppercase tracking-widest mb-1.5">
                              Pet Details
                            </label>
                            <input
                              type="text"
                              value={reviewForm.pet}
                              onChange={(e) => setReviewForm({...reviewForm, pet: e.target.value})}
                              placeholder="e.g. Luna (Golden Retriever)"
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold/50 transition-all"
                            />
                          </div>

                          {/* Star Rating */}
                          <div>
                            <label className="block text-white/80 font-sans text-xs font-semibold uppercase tracking-widest mb-2">
                              Rating <span className="text-gold">*</span>
                            </label>
                            <StarPicker 
                              value={reviewForm.rating} 
                              onChange={(val) => setReviewForm({...reviewForm, rating: val})} 
                            />
                          </div>

                          {/* Review Text */}
                          <div>
                            <label className="block text-white/80 font-sans text-xs font-semibold uppercase tracking-widest mb-1.5">
                              Your Review <span className="text-gold">*</span>
                            </label>
                            <textarea
                              value={reviewForm.text}
                              onChange={(e) => setReviewForm({...reviewForm, text: e.target.value})}
                              placeholder="Tell us what you think about this product…"
                              required
                              rows={4}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold/50 transition-all resize-none"
                            />
                          </div>

                          {/* Submit */}
                          {submitError && (
                            <p className="text-red-300 text-xs font-sans bg-red-500/20 px-3 py-2 rounded-lg border border-red-400/30">
                              {submitError}
                            </p>
                          )}
                          <div className="flex gap-3 pt-1">
                            <button
                              type="button"
                              onClick={closeForm}
                              className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-sans font-semibold text-sm rounded-xl transition-all duration-200 border border-white/20"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={!reviewForm.text.trim() || !user}
                              className="flex-1 py-3 bg-gold hover:bg-[#b89d5a] disabled:opacity-40 disabled:cursor-not-allowed text-plum font-sans font-bold text-sm rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] shadow-lg flex items-center justify-center gap-2"
                            >
                              <Send className="w-4 h-4" />
                              Post Review
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
            )}
        </div>
    );
}