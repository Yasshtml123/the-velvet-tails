import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '@/features/productsSlice.js';
import { addToCart } from '@/features/cartSlice.js';
import ImageGallery from './ImageGallery.jsx';
import { formatPrice } from '@/utils/formatters.js';
import { Heart, Share2, Truck, ShieldCheck, RotateCcw, Star } from 'lucide-react';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('Medium');
    const [selectedColor, setSelectedColor] = useState('Plum');

    const { currentProduct, isLoading, error } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        dispatch(fetchProductById(id));
    }, [dispatch, id]);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) return;
        if (currentProduct && newQuantity > currentProduct.inventory) {
            alert(`Only ${currentProduct.inventory} items available`);
            return;
        }
        setQuantity(newQuantity);
    };

    const handleAddToCart = () => {
        if (!currentProduct) return;

        if (!user) {
            navigate('/login', { state: { from: `/products/${currentProduct._id}` } });
            return;
        }

        if (currentProduct.inventory === 0 || quantity > currentProduct.inventory) {
            return;
        }

        dispatch(addToCart({ product: currentProduct, quantity }));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-plum mx-auto mb-4"></div>
                    <p className="text-charcoal/60 font-sans">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error || !currentProduct) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-3xl font-bold font-serif text-charcoal mb-4">Product Not Found</h1>
                    <p className="text-charcoal/60 font-sans mb-8">The product you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-3 bg-plum text-white rounded-full hover:bg-plum/90 font-sans font-medium transition-colors"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    const discountPercentage = currentProduct.compareAtPrice && currentProduct.compareAtPrice > currentProduct.price
        ? Math.round((1 - currentProduct.price / currentProduct.compareAtPrice) * 100)
        : 0;

    // Mock data for sizes, colors, and reviews
    const sizes = ['Small', 'Medium', 'Large'];
    const colors = [
        { name: 'Plum', hex: '#5C3975' },
        { name: 'Gold', hex: '#CBB26A' },
        { name: 'Charcoal', hex: '#1A1A2E' }
    ];
    
    // Convert text to bullet points safely
    const descriptionPoints = currentProduct.description?.split('. ').filter(Boolean) || [];

    const reviews = [
        { id: 1, author: "Jessica M.", date: "August 10, 2026", rating: 5, text: "Absolutely beautiful and fits perfectly. The material feels so premium." },
        { id: 2, author: "David K.", date: "July 22, 2026", rating: 4, text: "Great quality, but the color is slightly darker than the picture. Still love it." },
        { id: 3, author: "Amanda L.", date: "June 05, 2026", rating: 5, text: "My pet loves this! Will definitely order more from The Velvet Tails." }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 bg-cream min-h-screen">
            {/* Breadcrumbs */}
            <nav className="flex mb-8 text-sm font-sans">
                <Link to="/" className="text-charcoal/60 hover:text-plum transition-colors">Home</Link>
                <span className="mx-2 text-charcoal/40">/</span>
                <Link to="/products" className="text-charcoal/60 hover:text-plum transition-colors">Products</Link>
                <span className="mx-2 text-charcoal/40">/</span>
                <span className="text-charcoal/80 font-medium">{currentProduct.category}</span>
                <span className="mx-2 text-charcoal/40">/</span>
                <span className="text-plum font-semibold truncate">{currentProduct.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Image Gallery */}
                <div className="relative">
                    <ImageGallery images={currentProduct.images} />
                </div>

                {/* Product Info */}
                <div className="flex flex-col space-y-8">
                    {/* Title, Category & Price */}
                    <div>
                        <p className="text-sm font-sans font-bold text-gold uppercase tracking-wider mb-2">{currentProduct.category}</p>
                        <h1 className="text-3xl md:text-4xl font-bold font-serif text-charcoal mb-4 leading-tight">{currentProduct.title}</h1>
                        
                        <div className="flex items-baseline gap-3 mb-2">
                            <span className="text-3xl font-bold font-sans text-plum">
                                {formatPrice(currentProduct.price)}
                            </span>
                            {currentProduct.compareAtPrice && currentProduct.compareAtPrice > currentProduct.price && (
                                <>
                                    <span className="text-xl font-sans text-charcoal/40 line-through">
                                        {formatPrice(currentProduct.compareAtPrice)}
                                    </span>
                                    <span className="px-2.5 py-1 text-xs font-bold font-sans text-white bg-sage rounded-full shadow-sm">
                                        {discountPercentage}% OFF
                                    </span>
                                </>
                            )}
                        </div>
                        
                        {/* Rating Summary */}
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className={`w-4 h-4 ${star <= 4.5 ? 'text-gold fill-gold' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span className="text-sm font-sans text-charcoal/60 border-b border-dashed border-charcoal/40 hover:text-plum hover:border-plum cursor-pointer transition-colors">
                                {reviews.length} Reviews
                            </span>
                        </div>
                    </div>

                    {/* Variant Selectors */}
                    {!isAdmin && (
                        <div className="space-y-6 py-6 border-y border-blush/40">
                            {/* Color */}
                            <div>
                                <h4 className="text-sm font-bold font-sans text-charcoal mb-3">Color: <span className="font-normal text-charcoal/70">{selectedColor}</span></h4>
                                <div className="flex gap-3">
                                    {colors.map(color => (
                                        <button 
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedColor === color.name ? 'ring-2 ring-offset-2 ring-plum' : 'hover:scale-110'}`}
                                            style={{ backgroundColor: color.hex }}
                                            aria-label={`Select color ${color.name}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            {/* Size */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-sm font-bold font-sans text-charcoal">Size</h4>
                                    <button className="text-xs font-sans text-plum underline hover:text-plum/80">Size Guide</button>
                                </div>
                                <div className="flex gap-3">
                                    {sizes.map(size => (
                                        <button 
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`flex-1 py-3 border rounded-xl font-sans font-semibold text-sm transition-all ${
                                                selectedSize === size 
                                                ? 'border-plum bg-plum/5 text-plum' 
                                                : 'border-blush bg-white text-charcoal/70 hover:border-plum/50'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Description - Bullet Points */}
                    <div>
                        <h2 className="text-lg font-bold font-serif text-charcoal mb-4">Product Details</h2>
                        <ul className="space-y-2">
                            {descriptionPoints.map((point, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold mt-2 mr-3 flex-shrink-0"></span>
                                    <span className="text-charcoal/80 font-sans leading-relaxed">{point}{!point.endsWith('.') ? '.' : ''}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="pt-2">
                        {isAdmin ? (
                            <div className="bg-blush/20 border border-blush rounded-xl p-6">
                                <h3 className="font-bold font-sans text-plum mb-2 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5" /> Admin Controls
                                </h3>
                                <p className="text-sm font-sans text-charcoal/70 mb-4">
                                    You are viewing this product as an administrator. 
                                    Inventory: <span className="font-bold text-charcoal">{currentProduct.inventory} units</span>
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => navigate(`/admin/products/edit/${currentProduct._id}`)}
                                        className="flex-1 py-3 bg-plum hover:bg-plum/90 text-white font-sans font-semibold rounded-full transition-all shadow-md active:scale-95"
                                    >
                                        Edit Product
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    {/* Quantity */}
                                    <div className="flex items-center bg-white border border-blush rounded-full h-12">
                                        <button
                                            onClick={() => handleQuantityChange(quantity - 1)}
                                            className="px-4 text-charcoal/60 hover:text-plum font-bold text-lg"
                                            disabled={currentProduct.inventory === 0}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                            className="w-12 text-center font-sans font-semibold text-charcoal bg-transparent focus:outline-none"
                                            disabled={currentProduct.inventory === 0}
                                        />
                                        <button
                                            onClick={() => handleQuantityChange(quantity + 1)}
                                            className="px-4 text-charcoal/60 hover:text-plum font-bold text-lg"
                                            disabled={currentProduct.inventory === 0}
                                        >
                                            +
                                        </button>
                                    </div>
                                    
                                    {/* Add to Cart */}
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={currentProduct.inventory === 0}
                                        className="flex-1 h-12 bg-plum hover:bg-plum/90 text-white font-sans font-bold text-lg rounded-full shadow-lg shadow-plum/20 transition-all transform hover:scale-[1.02] active:scale-95 disabled:bg-charcoal/30 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
                                    >
                                        {currentProduct.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </button>
                                </div>
                                
                                {/* Secondary Actions */}
                                <div className="flex justify-center gap-6 mt-2">
                                    <button className="flex items-center gap-2 text-charcoal/60 hover:text-plum font-sans text-sm font-semibold transition-colors group">
                                        <div className="p-2 rounded-full bg-white border border-blush group-hover:border-plum group-hover:bg-plum/5 transition-all">
                                            <Heart className="w-4 h-4" />
                                        </div>
                                        Add to Wishlist
                                    </button>
                                    <button className="flex items-center gap-2 text-charcoal/60 hover:text-plum font-sans text-sm font-semibold transition-colors group">
                                        <div className="p-2 rounded-full bg-white border border-blush group-hover:border-plum group-hover:bg-plum/5 transition-all">
                                            <Share2 className="w-4 h-4" />
                                        </div>
                                        Share
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Inline Trust Badges */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-blush/40">
                        <div className="flex flex-col items-center text-center">
                            <Truck className="w-6 h-6 text-gold mb-2" strokeWidth={1.5} />
                            <span className="text-xs font-sans font-bold text-charcoal">Free Shipping</span>
                            <span className="text-[10px] font-sans text-charcoal/60">On orders &gt; ₹999</span>
                        </div>
                        <div className="flex flex-col items-center text-center border-x border-blush/40 px-2">
                            <RotateCcw className="w-6 h-6 text-gold mb-2" strokeWidth={1.5} />
                            <span className="text-xs font-sans font-bold text-charcoal">15-Day Returns</span>
                            <span className="text-[10px] font-sans text-charcoal/60">Hassle-free process</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <ShieldCheck className="w-6 h-6 text-gold mb-2" strokeWidth={1.5} />
                            <span className="text-xs font-sans font-bold text-charcoal">Secure Payment</span>
                            <span className="text-[10px] font-sans text-charcoal/60">100% safe checkout</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="mt-24 pt-16 border-t border-blush/50">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-bold font-serif text-charcoal mb-2">Customer Reviews</h2>
                        <div className="flex items-center gap-3">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-5 h-5 text-gold fill-gold" />
                                ))}
                            </div>
                            <span className="text-lg font-bold font-sans text-charcoal">4.8</span>
                            <span className="text-sm font-sans text-charcoal/60">Based on {reviews.length} reviews</span>
                        </div>
                    </div>
                    <button className="hidden md:inline-block px-6 py-3 border-2 border-plum text-plum font-sans font-bold rounded-full hover:bg-plum hover:text-white transition-all">
                        Write a Review
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-blush/30">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-gold fill-gold' : 'text-gray-200'}`} />
                                    ))}
                                </div>
                                <span className="text-xs font-sans text-charcoal/50">{review.date}</span>
                            </div>
                            <p className="text-charcoal/80 font-sans mb-4 leading-relaxed">"{review.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-plum/10 text-plum flex items-center justify-center font-bold text-xs">
                                    {review.author.charAt(0)}
                                </div>
                                <span className="font-bold font-sans text-sm text-charcoal">{review.author}</span>
                                <span className="text-xs font-sans text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1 ml-auto">
                                    <ShieldCheck className="w-3 h-3" /> Verified
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8 text-center md:hidden">
                    <button className="w-full px-6 py-3 border-2 border-plum text-plum font-sans font-bold rounded-full hover:bg-plum hover:text-white transition-all">
                        Write a Review
                    </button>
                </div>
            </div>
        </div>
    );
}
