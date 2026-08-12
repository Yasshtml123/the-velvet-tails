import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { findProduct } from '@/data/products.js';
import { addToCart } from '@/features/cartSlice.js';
import ImageGallery from './ImageGallery.jsx';
import { formatPrice } from '@/utils/formatters.js';
import { Star } from 'lucide-react';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('Medium');
    const [selectedColor, setSelectedColor] = useState('Plum');

    // Fetch directly from local static file to prevent white screen crashes
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
        { name: 'Charcoal', hex: '#1A1A2E' }
    ];

    const descriptionPoints = currentProduct.description?.split('. ').filter(Boolean) || [];

    const reviews = [
        { id: 1, author: "Jessica M.", date: "August 10, 2026", rating: 5, text: "Absolutely beautiful and fits perfectly. The material feels so premium." },
        { id: 2, author: "David K.", date: "July 22, 2026", rating: 4, text: "Great quality, but the color is slightly darker than the picture. Still love it." },
        { id: 3, author: "Amanda L.", date: "June 05, 2026", rating: 5, text: "My pet loves this! Will definitely order more from The Velvet Tails." }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 bg-cream min-h-screen">
            <nav className="flex mb-8 text-sm font-sans">
                <Link to="/" className="text-charcoal/60 hover:text-plum transition-colors">Home</Link>
                <span className="mx-2 text-charcoal/40">/</span>
                <Link to="/products" className="text-charcoal/60 hover:text-plum transition-colors">Products</Link>
                <span className="mx-2 text-charcoal/40">/</span>
                <span className="text-plum font-semibold truncate">{currentProduct?.title || 'Product'}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                <div className="relative">
                    <ImageGallery images={currentProduct?.images || []} />
                </div>

                <div className="flex flex-col space-y-8">
                    <div>
                        <p className="text-sm font-sans font-bold text-gold uppercase tracking-wider mb-2">{currentProduct?.category}</p>
                        <h1 className="text-3xl md:text-4xl font-bold font-serif text-charcoal mb-4 leading-tight">{currentProduct?.title}</h1>
                        <div className="flex items-baseline gap-3 mb-2">
                            <span className="text-3xl font-bold font-sans text-plum">
                                {formatPrice(currentProduct?.price || 0)}
                            </span>
                        </div>
                    </div>

                    {!isAdmin && (
                        <div className="space-y-6 py-6 border-y border-blush/40">
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

                            <div>
                                <h4 className="text-sm font-bold font-sans text-charcoal mb-3">Size</h4>
                                <div className="flex gap-3">
                                    {sizes.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`flex-1 py-3 border rounded-xl font-sans font-semibold text-sm transition-all ${selectedSize === size
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

                    <div className="pt-2">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center bg-white border border-blush rounded-full h-12">
                                <button onClick={() => handleQuantityChange(quantity - 1)} className="px-4 text-charcoal/60 hover:text-plum font-bold text-lg">-</button>
                                <input type="number" value={quantity} onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)} className="w-12 text-center font-sans font-semibold text-charcoal bg-transparent focus:outline-none" />
                                <button onClick={() => handleQuantityChange(quantity + 1)} className="px-4 text-charcoal/60 hover:text-plum font-bold text-lg">+</button>
                            </div>
                            <button onClick={handleAddToCart} className="flex-1 h-12 bg-plum hover:bg-plum/90 text-white font-sans font-bold text-lg rounded-full shadow-lg">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}