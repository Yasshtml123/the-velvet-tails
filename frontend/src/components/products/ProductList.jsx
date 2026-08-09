import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories, setFilters } from '@/features/productsSlice.js';
import ProductCard from '@/components/products/ProductCard.jsx';
import HeroBanner from '@/components/landing/HeroBanner.jsx';
import CategoryShowcase from '@/components/landing/CategoryShowcase.jsx';
import TrustBadges from '@/components/landing/TrustBadges.jsx';
import Testimonials from '@/components/landing/Testimonials.jsx';
import AboutPreview from '@/components/landing/AboutPreview.jsx';
import Newsletter from '@/components/landing/Newsletter.jsx';

export default function ProductList() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { items, categories, isLoading, error, filters } = useSelector((state) => state.products);
  const [searchInput, setSearchInput] = useState('');
  const [showLanding, setShowLanding] = useState(true);

  // Read category from URL params on mount and when URL changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      dispatch(setFilters({ category: categoryFromUrl }));
      setShowLanding(false);
    } else {
      // No category in URL - reset to landing page
      dispatch(setFilters({ category: null, search: null }));
      setShowLanding(true);
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  // Hide landing sections when filters are applied
  useEffect(() => {
    setShowLanding(!filters.category && !filters.search);
  }, [filters]);

  const handleCategoryChange = (category) => {
    dispatch(setFilters({ category: category === 'all' ? null : category }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchInput }));
  };

  const scrollToProducts = () => {
    setShowLanding(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Landing Page Sections - Only show when no filters */}
      {showLanding && (
        <>
          <HeroBanner onShopNow={scrollToProducts} />
          <TrustBadges />
          <CategoryShowcase />
          <Testimonials />
          <AboutPreview />
          <Newsletter />
          
          {/* Collection CTA Section */}
          <div className="py-20 bg-cream text-center border-t border-blush/30">
            <div className="max-w-3xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-plum mb-4">
                Explore Our Complete Collection
              </h2>
              <p className="text-charcoal/70 font-sans text-lg mb-8">
                Handpicked accessories for every pet personality
              </p>
              <button
                onClick={scrollToProducts}
                className="inline-flex items-center px-10 py-4 bg-plum hover:bg-plum/90 text-white font-sans font-bold text-lg rounded-full transition-all transform hover:scale-[1.02] active:scale-[0.97] shadow-xl shadow-plum/20"
              >
                Browse All Products
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Products Section - Show when landing is hidden */}
      {!showLanding && (
        <div id="products-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              All Products
            </h1>
            <p className="mt-2 text-gray-600">
              Browse our collection of pet accessories
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-velvet-purple focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-velvet-purple text-white rounded-md hover:bg-velvet-purple-dark focus:outline-none focus:ring-2 focus:ring-velvet-purple focus:ring-offset-2"
              >
                Search
              </button>
            </form>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-md transition-colors ${!filters.category
                  ? 'bg-velvet-purple text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-md transition-colors ${filters.category === category
                    ? 'bg-velvet-purple text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-velvet-purple"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
