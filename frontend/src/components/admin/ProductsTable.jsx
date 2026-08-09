// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { fetchProducts, deleteProduct } from '@/features/productsSlice.js';
// import { formatPrice } from '@/utils/formatters.js';





// export default function ProductsTable() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { items, isLoading, error } = useSelector((state) => state.products);

//   useEffect(() => {
//     dispatch(fetchProducts({ limit: 100 }));
//   }, [dispatch]);

//   const handleEdit = (id) => {
//     navigate(`/admin/products/edit/${id}`);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       try {
//         await dispatch(deleteProduct(id)).unwrap();
//       } catch (err) {
//         console.error('Failed to delete product:', err);
//       }
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Responsive Header */}
//       <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Product Management</h1>
//           <p className="mt-2 text-gray-600">Manage your product catalog</p>
//         </div>
//         <button
//           onClick={() => navigate('/admin/products/new')}
//           className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//         >
//           Add New Product
//         </button>
//       </div>

//       {error && (
//         <div className="mb-6 rounded-md bg-red-50 p-4">
//           <div className="text-sm text-red-800">{error}</div>
//         </div>
//       )}

//       {isLoading ? (
//         <div className="flex justify-center items-center py-12">
//           <div className="text-lg text-gray-600">Loading products...</div>
//         </div>
//       ) : items.length === 0 ? (
//         <div className="text-center py-12 bg-gray-50 rounded-lg">
//           <p className="text-gray-500">No products found. Add your first product!</p>
//         </div>
//       ) : (
//         <>
//           {/* Desktop Table - Hidden on mobile */}
//           <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Image
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Name
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Category
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Price
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Inventory
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {items.map((product) => (
                    
//                     <tr key={product._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="h-12 w-12 bg-gray-200 rounded-md overflow-hidden">
//                           {product.images && product.images.length > 0 ? (
//                             <img
//                               src={product.images[0].url || product.images[0]}
//                               alt={product.title}
//                               className="h-full w-full object-cover"
//                             />
//                           ) : (
//                             <div className="flex items-center justify-center h-full text-xs text-gray-400">
//                               No img
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-medium text-gray-900">{product.title}</div>
//                         <div className="text-sm text-gray-500">{product.tags?.join(', ') || '-'}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{product.category}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {formatPrice(product.price)}
//                         </div>
//                         {product.compareAtPrice && product.compareAtPrice > product.price && (
//                           <div className="text-xs text-gray-500 line-through">
//                             {formatPrice(product.compareAtPrice)}
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.inventory === 0
//                             ? 'bg-red-100 text-red-800'
//                             : product.inventory <= 10
//                               ? 'bg-yellow-100 text-yellow-800'
//                               : 'bg-green-100 text-green-800'
//                             }`}
//                         >
//                           {product.inventory}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
//                         <button
//                           onClick={() => handleEdit(product._id)}
//                           className="text-blue-600 hover:text-blue-900"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(product._id)}
//                           className="text-red-600 hover:text-red-900"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Mobile Card Layout - Shown only on mobile */}
//           <div className="md:hidden space-y-4">
//             {items.map((product) => (
//               <div key={product._id} className="bg-white shadow-md rounded-lg p-4">
//                 {/* Product Header with Image */}
//                 <div className="flex gap-4 mb-3">
//                   <div className="h-16 w-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
//                     {product.images && product.images.length > 0 ? (
//                       <img
//                         src={product.images[0].url || product.images[0]}
//                         alt={product.title}
//                         className="h-full w-full object-cover"
//                       />
//                     ) : (
//                       <div className="flex items-center justify-center h-full text-xs text-gray-400">
//                         No img
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="text-sm font-bold text-gray-900 truncate">{product.title}</div>
//                     <div className="text-xs text-gray-500">{product.category}</div>
//                     <div className="text-sm font-medium text-gray-900 mt-1">
//                       {formatPrice(product.price)}
//                       {product.compareAtPrice && product.compareAtPrice > product.price && (
//                         <span className="text-xs text-gray-500 line-through ml-2">
//                           {formatPrice(product.compareAtPrice)}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Inventory & Tags */}
//                 <div className="flex items-center justify-between mb-3">
//                   <span
//                     className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.inventory === 0
//                       ? 'bg-red-100 text-red-800'
//                       : product.inventory <= 10
//                         ? 'bg-yellow-100 text-yellow-800'
//                         : 'bg-green-100 text-green-800'
//                       }`}
//                   >
//                     Stock: {product.inventory}
//                   </span>
//                   {product.tags && product.tags.length > 0 && (
//                     <div className="text-xs text-gray-400 truncate max-w-[50%]">
//                       {product.tags.join(', ')}
//                     </div>
//                   )}
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleEdit(product._id)}
//                     className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(product._id)}
//                     className="flex-1 py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition-colors"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }


import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, deleteProduct } from '@/features/productsSlice.js';
import { formatPrice } from '@/utils/formatters.js';

// Helper to inject Cloudinary auto-format, quality, and width parameters
// Robust Cloudinary Optimizer
const optimizeCloudinaryUrl = (url, width = 150) => {
  if (!url || typeof url !== 'string') return url;

  // Handles both full CDN URLs and relative Cloudinary paths
  if (!url.includes('res.cloudinary.com') && !url.includes('/image/upload/')) {
    return url;
  }

  // Check if optimization flags are already applied
  if (url.includes('f_auto') || url.includes('q_auto')) {
    return url;
  }

  // Regex to safely inject parameters right after /upload/
  // regardless of version tags or dynamic subfolders
  const transformFlags = `f_auto,q_auto,w_${width},c_limit`;
  
  return url.replace(/\/image\/upload\/(?:v\d+\/)?/, (match) => {
    // If a version tag (e.g. /v1784563530/) was matched, preserve it
    if (match.includes('/v')) {
      const version = match.match(/v\d+\//)[0];
      return `/image/upload/${transformFlags}/${version}`;
    }
    return `/image/upload/${transformFlags}/`;
  });
};
export default function ProductsTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, isLoading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }));
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Responsive Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="mt-2 text-gray-600">Manage your product catalog</p>
        </div>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add New Product
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-gray-600">Loading products...</div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No products found. Add your first product!</p>
        </div>
      ) : (
        <>
          {/* Desktop Table - Hidden on mobile */}
          <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inventory
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((product) => {
                    const rawImageUrl = product.images && product.images.length > 0 
                      ? (product.images[0].url || product.images[0]) 
                      : null;
                    const optimizedImageUrl = optimizeCloudinaryUrl(rawImageUrl, 150);

                    console.log('Original:', rawImageUrl);
                    console.log('Optimized:', optimizedImageUrl);

                    return (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-12 w-12 bg-gray-200 rounded-md overflow-hidden">
                            {optimizedImageUrl ? (
                              <img
                                src={optimizedImageUrl}
                                alt={product.title}
                                width="48"
                                height="48"
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-xs text-gray-400">
                                No img
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{product.title}</div>
                          <div className="text-sm text-gray-500">{product.tags?.join(', ') || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(product.price)}
                          </div>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <div className="text-xs text-gray-500 line-through">
                              {formatPrice(product.compareAtPrice)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.inventory === 0
                                ? 'bg-red-100 text-red-800'
                                : product.inventory <= 10
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {product.inventory}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                          <button
                            onClick={() => handleEdit(product._id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Layout - Shown only on mobile */}
          <div className="md:hidden space-y-4">
            {items.map((product) => {
              const rawImageUrl = product.images && product.images.length > 0 
                ? (product.images[0].url || product.images[0]) 
                : null;
              const optimizedImageUrl = optimizeCloudinaryUrl(rawImageUrl, 200);

              return (
                <div key={product._id} className="bg-white shadow-md rounded-lg p-4">
                  {/* Product Header with Image */}
                  <div className="flex gap-4 mb-3">
                    <div className="h-16 w-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                      {optimizedImageUrl ? (
                        <img
                          src={optimizedImageUrl}
                          alt={product.title}
                          width="64"
                          height="64"
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-gray-400">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-900 truncate">{product.title}</div>
                      <div className="text-xs text-gray-500">{product.category}</div>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {formatPrice(product.price)}
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="text-xs text-gray-500 line-through ml-2">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Inventory & Tags */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.inventory === 0
                          ? 'bg-red-100 text-red-800'
                          : product.inventory <= 10
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      Stock: {product.inventory}
                    </span>
                    {product.tags && product.tags.length > 0 && (
                      <div className="text-xs text-gray-400 truncate max-w-[50%]">
                        {product.tags.join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}