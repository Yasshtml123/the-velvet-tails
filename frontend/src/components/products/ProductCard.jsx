// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { addToCart } from '@/features/cartSlice.js';
// import { deleteProduct, fetchProducts } from '@/features/productsSlice.js';
// import { formatPrice } from '@/utils/formatters.js';
// import ConfirmModal from '@/components/common/ConfirmModal.jsx';

// export default function ProductCard({ product }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);
//   const isAdmin = user?.role === 'admin';
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const [imageLoaded, setImageLoaded] = useState(false);

//   // Calculate discount percentage if compare price exists
//   const discountPercentage = product.compareAtPrice && product.compareAtPrice > product.price
//     ? Math.round((1 - product.price / product.compareAtPrice) * 100)
//     : 0;

//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     // Require login to add to cart
//     if (!user) {
//       navigate('/login', { state: { from: `/products/${product._id}` } });
//       return;
//     }

//     dispatch(addToCart({ product, quantity: 1 }));
//   };

//   const handleEdit = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     navigate(`/admin/products/edit/${product._id}`);
//   };

//   const handleDeleteClick = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setShowDeleteModal(true);
//   };

//   const handleConfirmDelete = async () => {
//     setIsDeleting(true);
//     try {
//       await dispatch(deleteProduct(product._id)).unwrap();
//       dispatch(fetchProducts());
//     } catch (error) {
//       console.error('Failed to delete product:', error);
//     } finally {
//       setIsDeleting(false);
//       setShowDeleteModal(false);
//     }
//   };

//   return (
//     <>
//       <div
//         className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 ease-out"
//         style={{
//           boxShadow: isHovered
//             ? '0 25px 50px -12px rgba(107, 51, 129, 0.35), 0 0 30px rgba(203, 178, 106, 0.2), 0 0 0 2px rgba(203, 178, 106, 0.4)'
//             : '0 4px 20px -2px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
//           transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
//         }}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {/* Discount Badge */}
//         {discountPercentage > 0 && (
//           <div className="absolute top-3 left-3 z-20">
//             <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
//               <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 011.476 3.324l-.477.573a3 3 0 01-4.33-.42L12 9l.667.477a3 3 0 01-4.33.42l-.477-.573A2 2 0 016 6H5z" clipRule="evenodd" />
//               </svg>
//               {discountPercentage}% OFF
//             </div>
//           </div>
//         )}

//         {/* Product Image */}
//         <Link to={`/products/${product._id}`} className="block relative overflow-hidden">
//           <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
//             {!imageLoaded && (
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="w-10 h-10 border-3 border-velvet-purple/20 border-t-velvet-purple rounded-full animate-spin" />
//               </div>
//             )}
//             {product.images && product.images.length > 0 ? (
//               <img
//                 src={product.images[0].url}
//                 alt={product.title}
//                 className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
//                 loading="lazy"
//                 onLoad={() => setImageLoaded(true)}
//               />
//             ) : (
//               <div className="flex flex-col items-center justify-center h-full text-gray-300">
//                 <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 <span className="text-sm">No Image</span>
//               </div>
//             )}

//             {/* Out of Stock Overlay */}
//             {product.inventory === 0 && (
//               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
//                 <span className="bg-white/90 text-gray-900 font-bold px-4 py-2 rounded-lg text-sm">
//                   Out of Stock
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Quick Add Button - Appears on hover */}
//           {!isAdmin && product.inventory > 0 && (
//             <div className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
//               <button
//                 onClick={handleAddToCart}
//                 className="w-full py-3 bg-velvet-purple hover:bg-velvet-purple/90 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-xl active:scale-95"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//                 </svg>
//                 Add to Cart
//               </button>
//             </div>
//           )}
//         </Link>

//         {/* Product Info */}
//         <div className="p-4">
//           {/* Category Badge */}
//           <div className="mb-2">
//             <span className="inline-block px-2.5 py-1 bg-velvet-purple/10 text-velvet-purple text-xs font-medium rounded-full">
//               {product.category}
//             </span>
//           </div>

//           {/* Product Title */}
//           <Link to={`/products/${product._id}`} className="block group/title">
//             <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2 group-hover/title:text-velvet-purple transition-colors duration-200 leading-snug">
//               {product.title}
//             </h3>
//           </Link>

//           {/* Rating Stars removed - not implemented yet */}

//           {/* Price Section */}
//           <div className="flex items-end justify-between">
//             <div className="flex items-baseline gap-2">
//               <span className="text-xl font-bold text-gray-900">
//                 {formatPrice(product.price)}
//               </span>
//               {product.compareAtPrice && product.compareAtPrice > product.price && (
//                 <span className="text-sm text-gray-400 line-through">
//                   {formatPrice(product.compareAtPrice)}
//                 </span>
//               )}
//             </div>

//             {/* Stock Indicator */}
//             {product.inventory > 0 && product.inventory <= 10 && (
//               <div className="flex items-center gap-1 text-orange-500">
//                 <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
//                 <span className="text-xs font-medium">Only {product.inventory} left</span>
//               </div>
//             )}
//           </div>

//           {/* Admin Controls */}
//           {isAdmin && (
//             <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
//               <button
//                 onClick={handleEdit}
//                 className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-velvet-purple to-purple-600 text-white rounded-lg hover:from-velvet-purple/90 hover:to-purple-600/90 transition-all duration-200 text-sm font-medium shadow-sm"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                 </svg>
//                 Edit
//               </button>
//               <button
//                 onClick={handleDeleteClick}
//                 className="px-3 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 text-sm font-medium"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                 </svg>
//               </button>
//             </div>
//           )}

//           {/* Stock Info for Admin */}
//           {isAdmin && (
//             <div className="mt-3 flex items-center gap-2">
//               <div className={`w-2 h-2 rounded-full ${product.inventory > 10 ? 'bg-green-500' : product.inventory > 0 ? 'bg-orange-500' : 'bg-red-500'}`} />
//               <span className={`text-xs font-medium ${product.inventory > 10 ? 'text-green-600' : product.inventory > 0 ? 'text-orange-600' : 'text-red-600'}`}>
//                 {product.inventory} in stock
//               </span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       <ConfirmModal
//         isOpen={showDeleteModal}
//         onClose={() => setShowDeleteModal(false)}
//         onConfirm={handleConfirmDelete}
//         title="Delete Product"
//         message={`Are you sure you want to delete "${product.title}"? This action cannot be undone.`}
//         confirmText={isDeleting ? "Deleting..." : "Delete"}
//         cancelText="Cancel"
//         type="danger"
//       />
//     </>
//   );
// }

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/features/cartSlice.js';
import { deleteProduct, fetchProducts } from '@/features/productsSlice.js';
import { formatPrice } from '@/utils/formatters.js';
import { optimizeCloudinaryUrl } from '@/utils/cloudinary.js';
import ConfirmModal from '@/components/common/ConfirmModal.jsx';
import { Heart, Star } from 'lucide-react';


export default function ProductCard({ product, viewMode = 'grid' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Derive raw and optimized image URLs
  const rawImageUrl = product.images && product.images.length > 0 
    ? (product.images[0].url || product.images[0]) 
    : null;
  const optimizedImageUrl = optimizeCloudinaryUrl(rawImageUrl, 500);

  // Mock data for badges and ratings
  const badgeLabels = ['Bestseller', 'New', 'Trending', null, null];
  const badge = product.tags && product.tags.length > 0 ? product.tags[0] : badgeLabels[product.title.length % badgeLabels.length];
  const rating = (4.0 + (product.title.length % 10) / 10).toFixed(1);
  const reviewsCount = 10 + (product.title.length % 50);

  // Calculate discount percentage if compare price exists
  const discountPercentage = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;


  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login', { state: { from: `/products/${product._id}` } });
      return;
    }

    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/admin/products/edit/${product._id}`);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteProduct(product._id)).unwrap();
      dispatch(fetchProducts());
    } catch (error) {
      console.error('Failed to delete product:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div
        className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 ease-out ${
          viewMode === 'list' ? 'flex flex-row items-stretch' : 'flex flex-col'
        }`}
        style={{
          boxShadow: isHovered
            ? '0 25px 50px -12px rgba(107, 51, 129, 0.35), 0 0 30px rgba(203, 178, 106, 0.2), 0 0 0 2px rgba(203, 178, 106, 0.4)'
            : '0 4px 20px -2px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 z-20">
            <div className="bg-sage text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
              {discountPercentage}% OFF
            </div>
          </div>
        )}

        {/* Product Badge */}
        {badge && discountPercentage === 0 && (
          <div className="absolute top-3 left-3 z-20">
            <div className="bg-plum text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md">
              {badge}
            </div>
          </div>
        )}

        {/* Wishlist Icon */}
        <button className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-charcoal/40 hover:text-red-500 hover:bg-white transition-all duration-300 shadow-sm ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Heart className="w-4 h-4" />
        </button>


        {/* Product Image */}
        <Link 
          to={`/products/${product._id}`} 
          className={`block relative overflow-hidden ${viewMode === 'list' ? 'w-1/3 shrink-0 border-r border-blush/30' : 'w-full'}`}
        >
          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-velvet-purple/20 border-t-velvet-purple rounded-full animate-spin" />
              </div>
            )}
            {optimizedImageUrl ? (
              <img
                src={optimizedImageUrl}
                alt={product.title}
                className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-300">
                <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">No Image</span>
              </div>
            )}

            {/* Out of Stock Overlay */}
            {product.inventory === 0 && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-white/90 text-gray-900 font-bold px-4 py-2 rounded-lg text-sm">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Quick Add Button - Appears on hover */}
          {!isAdmin && product.inventory > 0 && (
            <div className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
              <button
                onClick={handleAddToCart}
                className="w-full py-3 bg-velvet-purple hover:bg-velvet-purple/90 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-xl active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </button>
            </div>
          )}
        </Link>

        {/* Product Info */}
        <div className={`p-4 flex flex-col justify-between ${viewMode === 'list' ? 'w-2/3 sm:p-6' : 'w-full'}`}>
          <div className="mb-2">
            <span className="inline-block px-2.5 py-1 bg-velvet-purple/10 text-velvet-purple text-xs font-medium rounded-full">
              {product.category}
            </span>
          </div>

          <Link to={`/products/${product._id}`} className="block group/title">
            <h3 className={`font-semibold text-charcoal mb-1 group-hover/title:text-plum transition-colors duration-200 leading-snug font-sans ${viewMode === 'list' ? 'text-lg line-clamp-2' : 'text-base line-clamp-2'}`}>
              {product.title}
            </h3>
          </Link>

          {viewMode === 'list' && (
            <p className="text-sm text-charcoal/60 font-sans line-clamp-2 mb-3 mt-1">
              {product.description}
            </p>
          )}

          {/* Ratings */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 text-gold fill-gold" />
            <span className="text-xs font-bold text-charcoal font-sans">{rating}</span>
            <span className="text-xs text-charcoal/50 font-sans">({reviewsCount})</span>
          </div>


          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {product.inventory > 0 && product.inventory <= 10 && (
              <div className="flex items-center gap-1 text-orange-500">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium">Only {product.inventory} left</span>
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={handleEdit}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-velvet-purple to-purple-600 text-white rounded-lg hover:from-velvet-purple/90 hover:to-purple-600/90 transition-all duration-200 text-sm font-medium shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="px-3 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}

          {isAdmin && (
            <div className="mt-3 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.inventory > 10 ? 'bg-green-500' : product.inventory > 0 ? 'bg-orange-500' : 'bg-red-500'}`} />
              <span className={`text-xs font-medium ${product.inventory > 10 ? 'text-green-600' : product.inventory > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                {product.inventory} in stock
              </span>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.title}"? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
}