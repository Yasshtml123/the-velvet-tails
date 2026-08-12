import { useState } from 'react';
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
    MessageCircle, Link2, ShoppingBag 
} from 'lucide-react';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('Medium');
    const [selectedColor, setSelectedColor] = useState('Plum');
    
    // Accordion states
    const [openAccordion, setOpenAccordion] = useState('description');

    const currentProduct = findProduct(id);

    const { user } = useSelector((state) => state.auth || {});
    const isAdmin = user?.role === 'admin';

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) return;
        if (currentProduct && newQuantity > currentProduct.inventory) {
            alert(`Only ${currentProduct.inventory} items available`);
            return;
        }
        setQuantity(newQuantity);
    };

    const handleAddToCart = () => {
        if (!currentProduct || !currentProduct?._id) return;
        dispatch(addToCart({ product: currentProduct, quantity }));
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/checkout');
    };

    const toggleAccordion = (section) => {
        setOpenAccordion(openAccordion === section ? null : section);
    };

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

    const sizes = ['Small', 'Medium', 'Large'];
    const colors = [
        { name: 'Plum', hex: '#5C3975' },
        { name: 'Gold', hex: '#CBB26A' },
        { name: 'Charcoal', hex: '#1A1A2E' },
        { name: 'Red', hex: '#E3342F' },
        { name: 'Blue', hex: '#3490DC' },
        { name: 'Black', hex: '#000000' },
        { name: 'Brown', hex: '#8B4513' },
        { name: 'Orange', hex: '#F6993F' },
    ];
    
    // Attempt to match product color to our list, or default to Plum
    const matchingColor = colors.find(c => currentProduct?.color?.toLowerCase() === c.name.toLowerCase()) || colors[0];
    
    const displayColors = [
        matchingColor,
        ...colors.filter(c => c.name !== matchingColor.name).slice(0, 3)
    ];

    const descriptionPoints = currentProduct.description?.split('. ').filter(Boolean) || [];

    const reviews = [
        { id: 1, author: "Jessica M.", avatar: "J", date: "August 10, 2026", rating: 5, verified: true, text: "Absolutely beautiful and fits perfectly. The material feels so premium." },
        { id: 2, author: "David K.", avatar: "D", date: "July 22, 2026", rating: 4, verified: true, text: "Great quality, but the color is slightly darker than the picture. Still love it." },
        { id: 3, author: "Amanda L.", avatar: "A", date: "June 05, 2026", rating: 5, verified: false, text: "My pet loves this! Will definitely order more from The Velvet Tails." }
    ];

    // Mock calculations
    const discountPercentage = currentProduct.compareAtPrice && currentProduct.compareAtPrice > currentProduct.price
        ? Math.round((1 - currentProduct.price / currentProduct.compareAtPrice) * 100)
        : 0;

    const rating = 4.8;
    const reviewCount = 128;
    
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
                    <ImageGallery images={currentProduct?.images || []} />
                </div>

                {/* Product Info */}
                <div className="lg:col-span-5 flex flex-col space-y-6">
                    {/* Header & Pricing */}
                    <div className="border-b border-blush/40 pb-6">
                        <p className="text-sm font-sans font-bold text-sage uppercase tracking-wider mb-2">{currentProduct?.category}</p>
                        <h1 className="text-2xl md:text-3xl font-bold font-serif text-charcoal mb-3 leading-tight">{currentProduct?.title}</h1>
                        
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
                                {formatPrice(currentProduct?.price || 0)}
                            </span>
                            {currentProduct.compareAtPrice && currentProduct.compareAtPrice > currentProduct.price && (
                                <span className="text-lg text-charcoal/40 line-through mb-1">
                                    {formatPrice(currentProduct.compareAtPrice)}
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
                                <div className="flex gap-3">
                                    {displayColors.map(color => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all relative ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-plum' : 'hover:scale-110 ring-1 ring-gray-200'}`}
                                            style={{ backgroundColor: color.hex }}
                                            aria-label={`Select color ${color.name}`}
                                        >
                                            {selectedColor === color.name && (
                                                <Check className={`w-4 h-4 ${color.name === 'White' || color.name === 'Gold' ? 'text-charcoal' : 'text-white'}`} />
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
                                <div className="grid grid-cols-3 gap-3">
                                    {sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-2.5 border rounded-lg font-sans font-semibold text-sm transition-all ${selectedSize === size
                                                    ? 'border-plum bg-plum/5 text-plum ring-1 ring-plum'
                                                    : 'border-gray-200 bg-white text-charcoal/70 hover:border-plum/50 hover:bg-gray-50'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
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
                                    <div>Premium Velvet & Vegan Leather</div>
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
                                const percentage = star === 5 ? 75 : star === 4 ? 15 : star === 3 ? 5 : star === 2 ? 3 : 2;
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

                        <button className="w-full py-3 border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white rounded-lg font-bold transition-colors">
                            Write a Review
                        </button>
                    </div>

                    {/* Review List */}
                    <div className="md:col-span-8 space-y-8">
                        {reviews.map(review => (
                            <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-plum/10 text-plum font-bold flex items-center justify-center text-lg">
                                            {review.avatar}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-charcoal">{review.author}</span>
                                                {review.verified && (
                                                    <span className="flex items-center text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-semibold">
                                                        <CheckCircle className="w-3 h-3 mr-1" /> Verified
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-charcoal/50">{review.date}</span>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-gold fill-gold' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-charcoal/80 font-sans leading-relaxed mb-4 pl-14">
                                    "{review.text}"
                                </p>
                                <div className="flex items-center gap-4 pl-14">
                                    <span className="text-xs text-charcoal/50">Was this review helpful?</span>
                                    <button className="flex items-center gap-1 text-xs font-medium text-charcoal/60 hover:text-plum transition-colors">
                                        <ThumbsUp className="w-3.5 h-3.5" /> Yes ({(review.id * 3) + 2})
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        <div className="pt-4 text-center">
                            <button className="text-plum font-semibold hover:underline">Read All {reviewCount} Reviews</button>
                        </div>
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
        </div>
    );
}