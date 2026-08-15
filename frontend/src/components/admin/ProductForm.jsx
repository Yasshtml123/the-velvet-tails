/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, fetchProductById, clearCurrentProduct } from '@/features/productsSlice.js';

const MAX_IMAGES = 5;

export default function ProductForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct, isLoading, error } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    inventory: '',
    tags: '',
    size: '',
    color: '',
    length: '10',
    breadth: '10',
    height: '10',
    weight: '0.5'
  });
  const [existingImages, setExistingImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchProductById(id));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (isEditMode && currentProduct) {
      setFormData({
        title: currentProduct.title || '',
        description: currentProduct.description || '',
        price: currentProduct.price ? (currentProduct.price / 100).toFixed(2) : '',
        category: currentProduct.category || '',
        inventory: currentProduct.inventory || '',
        tags: currentProduct.tags ? currentProduct.tags.join(', ') : '',
        size: currentProduct.size || '',
        color: currentProduct.color || '',
        length: currentProduct.dimensions?.length || '10',
        breadth: currentProduct.dimensions?.breadth || '10',
        height: currentProduct.dimensions?.height || '10',
        weight: currentProduct.dimensions?.weight || '0.5'
      });

      setExistingImages((currentProduct.images || [])
        .map((img) => ({
          url: img.url || img,
          publicId: img.publicId || null
        }))
        .filter((img) => img.url)
      );
      setRemovedImageIds([]);
      setNewImageFiles([]);
      setNewImagePreviews([]);
      setImageError('');
    }
  }, [currentProduct, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 0) {
      const keptExistingCount = existingImages.filter((img) => !removedImageIds.includes(img.publicId)).length;
      const slotsLeft = Math.max(0, MAX_IMAGES - keptExistingCount - newImageFiles.length);
      const acceptedFiles = files.slice(0, slotsLeft);

      if (acceptedFiles.length < files.length) {
        setImageError(`You can keep up to ${MAX_IMAGES} images total. Remove an existing image to add more.`);
      } else {
        setImageError('');
      }

      if (acceptedFiles.length === 0) {
        e.target.value = '';
        return;
      }

      const readFiles = acceptedFiles.map((file) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      }));

      Promise.all(readFiles).then((previews) => {
        setNewImageFiles((prev) => [...prev, ...acceptedFiles]);
        setNewImagePreviews((prev) => [...prev, ...previews]);
      });
    }

    e.target.value = '';
  };

  const toggleExistingImage = (publicId) => {
    if (!publicId) return;

    setRemovedImageIds((prev) => (
      prev.includes(publicId)
        ? prev.filter((id) => id !== publicId)
        : [...prev, publicId]
    ));
  };

  const removeNewImage = (indexToRemove) => {
    setNewImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    setNewImagePreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = new FormData();
    productData.append('title', formData.title);
    productData.append('description', formData.description);
    productData.append('price', parseFloat(formData.price).toFixed(2));
    productData.append('category', formData.category);
    productData.append('inventory', formData.inventory);

    if (formData.tags && formData.tags.trim()) {
      const tagsArray = formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
      productData.append('tags', tagsArray.join(','));
    }

    if (formData.size && formData.size.trim()) {
      productData.append('size', formData.size.trim());
    }

    if (formData.color && formData.color.trim()) {
      productData.append('color', formData.color.trim());
    }

    productData.append('dimensions', JSON.stringify({
      length: parseFloat(formData.length) || 10,
      breadth: parseFloat(formData.breadth) || 10,
      height: parseFloat(formData.height) || 10,
      weight: parseFloat(formData.weight) || 0.5
    }));

    removedImageIds.forEach((publicId) => {
      productData.append('removeImages', publicId);
    });

    newImageFiles.forEach((file) => {
      productData.append('images', file);
    });

    try {
      if (isEditMode) {
        await dispatch(updateProduct({ id, productData })).unwrap();
      } else {
        await dispatch(createProduct(productData)).unwrap();
      }
      navigate('/admin/products');
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Product Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <input
              type="text"
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Toys, Food, Accessories"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., organic, premium, bestseller (comma-separated)"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">Separate multiple tags with commas</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (₹) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Inventory</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="inventory" className="block text-sm font-medium text-gray-700">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="inventory"
                name="inventory"
                required
                min="0"
                value={formData.inventory}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Product Attributes</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                Size
              </label>
              <input
                type="text"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g., Small, Medium, Large"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g., Red, Blue, Black"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Shipping Dimensions</h2>
          <p className="text-sm text-gray-500">Used for accurate shipping cost calculation</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700">
                Length (cm) *
              </label>
              <input
                type="number"
                id="length"
                name="length"
                required
                step="0.1"
                min="0"
                value={formData.length}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="breadth" className="block text-sm font-medium text-gray-700">
                Width (cm) *
              </label>
              <input
                type="number"
                id="breadth"
                name="breadth"
                required
                step="0.1"
                min="0"
                value={formData.breadth}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                Height (cm) *
              </label>
              <input
                type="number"
                id="height"
                name="height"
                required
                step="0.1"
                min="0"
                value={formData.height}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Weight (kg) *
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                required
                step="0.01"
                min="0"
                value={formData.weight}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Images</h2>
          <p className="text-sm text-gray-500">
            Keep up to {MAX_IMAGES} images total. Remove existing images here to make room for new uploads.
          </p>

          {imageError && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
              {imageError}
            </p>
          )}

          {existingImages.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Existing Images {removedImageIds.length > 0 ? `(removing ${removedImageIds.length})` : ''}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {existingImages.map((image, index) => {
                  const isRemoved = removedImageIds.includes(image.publicId);

                  return (
                    <div key={image.publicId || image.url || index} className="relative">
                      <img
                        src={image.url}
                        alt={`Existing ${index + 1}`}
                        className={`h-32 w-full object-cover rounded-md border ${isRemoved ? 'border-red-300 opacity-40' : 'border-gray-300'}`}
                      />
                      <button
                        type="button"
                        onClick={() => toggleExistingImage(image.publicId)}
                        className={`absolute top-1 right-1 text-white text-xs px-2 py-1 rounded ${isRemoved ? 'bg-green-600' : 'bg-red-600'}`}
                      >
                        {isRemoved ? 'Keep' : 'Remove'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Product Images (up to 5)
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-1 text-sm text-gray-500">Select additional images. Hold Ctrl/Cmd to select multiple files.</p>
          </div>

          {newImagePreviews.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">New Image Previews:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {newImagePreviews.map((preview, index) => (
                  <div key={`${preview}-${index}`} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="h-32 w-full object-cover rounded-md border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 bg-gray-900/80 text-white text-xs px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                    <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500">
            Keeping {existingImages.filter((image) => !removedImageIds.includes(image.publicId)).length} existing and {newImageFiles.length} new image{newImageFiles.length === 1 ? '' : 's'}.
          </p>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
