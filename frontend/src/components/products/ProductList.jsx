import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories, setFilters } from '@/features/productsSlice.js';
import ProductCard from '@/components/products/ProductCard.jsx';
import HeroBanner from '@/components/landing/HeroBanner.jsx';
import TrustBadges from '@/components/landing/TrustBadges.jsx';
import NewArrivalsGrid from '@/components/landing/NewArrivalsGrid.jsx';
import CategoryShowcase from '@/components/landing/CategoryShowcase.jsx';
import PromoBanner from '@/components/landing/PromoBanner.jsx';
import Testimonials from '@/components/landing/Testimonials.jsx';
import Newsletter from '@/components/landing/Newsletter.jsx';
import { ChevronDown, X, ArrowUpDown, Star, LayoutGrid, List, Check } from 'lucide-react';

// Sort options
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'name_asc', label: 'Name: A → Z' },
];

export default function ProductList() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, categories, isLoading, error, filters } = useSelector((state) => state.products);
  // Local UI state
  const [showLanding, setShowLanding] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortOpen, setSortOpen] = useState(false);
  
  // Sidebar filter state
  const [sortBy, setSortBy] = useState('relevance');
  const [petType, setPetType] = useState('All');
  const [priceRange, setPriceRange] = useState([200, 2500]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [availability, setAvailability] = useState('All');

  // Filter constants
  const SIZES = ['Small', 'Medium', 'Large', 'XL'];
  const COLORS = ['Red', 'Brown', 'Black', 'Purple', 'Beige', 'Blue'];
  const COLOR_MAP = {
    'Red': 'bg-red-500', 'Brown': 'bg-amber-800', 'Black': 'bg-black',
    'Purple': 'bg-velvet-purple', 'Beige': 'bg-[#F5F5DC]', 'Blue': 'bg-blue-500'
  };

  // Read category AND search from URL params whenever the URL changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const searchFromUrl   = searchParams.get('search');
    const isViewAll       = searchParams.get('view') === 'all';
    
    if (categoryFromUrl || searchFromUrl) {
      dispatch(setFilters({
        category: categoryFromUrl || null,
        search:   searchFromUrl   || null,
      }));
      setShowLanding(false);
    } else if (isViewAll) {
      dispatch(setFilters({ category: null, search: null }));
      setShowLanding(false);
    } else {
      // No filters in URL - reset to landing page
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
    if (filters.category || filters.search) {
      setShowLanding(false);
    }
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

  const handleClearAllFilters = () => {
    setSortBy('relevance');
    setPetType('All');
    setPriceRange([200, 2500]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedRating(null);
    setAvailability('All');
    dispatch(setFilters({ category: null, search: null }));
    setSearchParams({ view: 'all' }); 
  };

  const toggleArrayItem = (array, setArray, item) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Relevance';

  const displayedItems = useMemo(() => {
    let result = [...items];

    // 0. Pet Type
    if (petType === 'Dogs') {
      result = result.filter(p => p.category && !p.category.toLowerCase().includes('cat'));
    } else if (petType === 'Cats') {
      result = result.filter(p => p.category && p.category.toLowerCase().includes('cat'));
    }

    // 1. Price Range
    // Note: The UI slider says 200 to 2500. Our price is in rupees (100 paise = 1 rupee).
    result = result.filter(p => (p.price / 100) >= priceRange[0] && (p.price / 100) <= priceRange[1]);

    // 2. Size
    if (selectedSizes.length > 0) {
      result = result.filter(p => selectedSizes.includes(p.size));
    }

    // 3. Color
    if (selectedColors.length > 0) {
      result = result.filter(p => selectedColors.includes(p.color));
    }

    // 5. Rating
    if (selectedRating !== null) {
      result = result.filter(p => {
        const mockRating = parseFloat((4.0 + (p.title.length % 10) / 10).toFixed(1));
        return mockRating >= selectedRating;
      });
    }

    // 6. Availability
    if (availability === 'In Stock') {
      result = result.filter(p => p.inventory > 0);
    } else if (availability === 'Pre-Order') {
      result = result.filter(p => p.inventory === 0);
    }

    // Sort
    switch (sortBy) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case 'name_asc': result.sort((a, b) => a.title.localeCompare(b.title)); break;
      default: break;
    }

    return result;
  }, [items, sortBy, petType, priceRange, selectedSizes, selectedColors, selectedRating, availability]);

  return (
    <div className="min-h-screen">
      {/* Landing Page Sections - Only show when no filters */}
      {showLanding && (
        <>
          {/* 1 ── Hero */}
          <HeroBanner onShopNow={scrollToProducts} />

          {/* 2 ── Trust Badges */}
          <TrustBadges />

          {/* 3 ── New Arrivals Grid — receives products directly from parent's Redux fetch */}
          <NewArrivalsGrid
            products={items}
            isLoading={isLoading}
            onBrowseAll={scrollToProducts}
          />


          {/* 4 ── Shop by Category */}
          <CategoryShowcase />

          {/* 5 ── Promotional Banner (Night Walk Collection) */}
          <PromoBanner onShopNow={scrollToProducts} />

          {/* 6 ── Happy Tails Reviews */}
          <Testimonials />

          {/* 7 ── Newsletter */}
          <Newsletter />
        </>
      )}

      {/* Products Section - Show when landing is hidden */}
      {!showLanding && (
        <div id="products-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
            
            {/* ── Left Sidebar (Filters) ── */}
            <div className="w-full">
            <div className="bg-white border border-blush/60 rounded-2xl p-6 shadow-sm lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif font-bold text-lg text-plum">Filters</h2>
                <button onClick={handleClearAllFilters} className="text-xs font-sans font-semibold text-charcoal/50 hover:text-plum transition-colors underline underline-offset-2">
                  Clear All
                </button>
              </div>

              <div className="space-y-6 divide-y divide-blush/40">
                
                {/* Pet Type */}
                <div className="pt-4 first:pt-0">
                  <h3 className="font-sans font-semibold text-sm text-charcoal mb-3">Pet Type</h3>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setPetType(petType === 'Dogs' ? 'All' : 'Dogs')}
                      className={`px-4 py-2 text-left rounded-xl border text-sm font-sans font-semibold transition-all duration-200 ${petType === 'Dogs' ? 'bg-plum text-white border-plum shadow-sm' : 'bg-white text-charcoal border-blush hover:border-plum/40 hover:bg-cream'}`}
                    >
                      All Dogs Products
                    </button>
                    <button 
                      onClick={() => setPetType(petType === 'Cats' ? 'All' : 'Cats')}
                      className={`px-4 py-2 text-left rounded-xl border text-sm font-sans font-semibold transition-all duration-200 ${petType === 'Cats' ? 'bg-plum text-white border-plum shadow-sm' : 'bg-white text-charcoal border-blush hover:border-plum/40 hover:bg-cream'}`}
                    >
                      All Cats Products
                    </button>
                  </div>
                </div>

                {/* Price Range */}
                <div className="pt-6">
                  <h3 className="font-sans font-semibold text-sm text-charcoal mb-4 flex justify-between items-center">
                    Price Range
                    <span className="font-normal text-xs text-charcoal/60">₹{priceRange[0]} - ₹{priceRange[1]}</span>
                  </h3>
                  <div className="px-2">
                    <input 
                      type="range" 
                      min="200" max="2500" step="50"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-1 bg-blush rounded-lg appearance-none cursor-pointer accent-plum"
                    />
                  </div>
                </div>

                {/* Size */}
                <div className="pt-6">
                  <h3 className="font-sans font-semibold text-sm text-charcoal mb-3">Size</h3>
                  <div className="space-y-2.5">
                    {SIZES.map(size => (
                      <label key={size} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={selectedSizes.includes(size)}
                          onChange={() => toggleArrayItem(selectedSizes, setSelectedSizes, size)}
                        />
                        <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${selectedSizes.includes(size) ? 'bg-plum border-plum text-white' : 'border-charcoal/30 bg-white group-hover:border-plum/50'}`}>
                          {selectedSizes.includes(size) && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-sm font-sans text-charcoal/80 group-hover:text-charcoal transition-colors">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div className="pt-6">
                  <h3 className="font-sans font-semibold text-sm text-charcoal mb-3">Color</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {COLORS.map(color => (
                      <button 
                        key={color}
                        title={color}
                        onClick={() => toggleArrayItem(selectedColors, setSelectedColors, color)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${selectedColors.includes(color) ? 'border-plum scale-110 shadow-sm' : 'border-transparent hover:scale-110'} ${COLOR_MAP[color]} ${color === 'Beige' ? 'border-gray-200' : ''}`}
                      >
                        {selectedColors.includes(color) && <Check className={`w-3.5 h-3.5 mx-auto ${color === 'Beige' ? 'text-charcoal' : 'text-white'}`} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="pt-6">
                  <h3 className="font-sans font-semibold text-sm text-charcoal mb-3">Rating</h3>
                  <div className="space-y-2">
                    {[5, 4, 3].map(stars => (
                      <label key={stars} className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="rating" 
                          className="hidden" 
                          checked={selectedRating === stars}
                          onChange={() => setSelectedRating(stars)}
                        />
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${selectedRating === stars ? 'border-plum' : 'border-charcoal/30 group-hover:border-plum/50'}`}>
                          {selectedRating === stars && <div className="w-2 h-2 rounded-full bg-plum" />}
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < stars ? 'text-gold fill-gold' : 'text-gray-200 fill-gray-200'}`} />
                          ))}
                        </div>
                        <span className="text-xs font-sans text-charcoal/60">& Up</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="pt-6">
                  <h3 className="font-sans font-semibold text-sm text-charcoal mb-3">Availability</h3>
                  <div className="space-y-2">
                    {['All', 'In Stock', 'Pre-Order'].map(status => (
                      <label key={status} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="availability" 
                          className="hidden" 
                          checked={availability === status}
                          onChange={() => setAvailability(status)}
                        />
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${availability === status ? 'border-plum' : 'border-charcoal/30 group-hover:border-plum/50'}`}>
                          {availability === status && <div className="w-2 h-2 rounded-full bg-plum" />}
                        </div>
                        <span className="text-sm font-sans text-charcoal/80 group-hover:text-charcoal transition-colors">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
              
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full mt-8 py-3 bg-plum hover:bg-plum/90 text-white font-sans font-bold text-sm rounded-xl transition-all shadow-sm shadow-plum/20"
              >
                Apply Filters
              </button>
            </div>
            </div>
            {/* ── Main content ── */}
            <div className="min-w-0">
              
              {/* Header & Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-bold font-serif text-plum mb-1">
                    {filters.category ? filters.category : 'All Products'}
                  </h1>
                  <p className="text-charcoal/60 font-sans text-sm">
                    {isLoading
                      ? 'Loading...'
                      : `Showing 1 - ${displayedItems.length} of ${displayedItems.length} items`}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* All Button */}
                  <button
                    onClick={handleClearAllFilters}
                    className="px-4 py-2 bg-white border border-blush/60 rounded-xl font-sans text-sm font-semibold text-charcoal hover:border-plum/40 hover:bg-cream transition-all duration-200 shadow-sm"
                  >
                    All
                  </button>

                  {/* View Toggles */}
                  <div className="flex items-center bg-white border border-blush/60 rounded-xl p-1 shadow-sm">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-plum/10 text-plum' : 'text-charcoal/40 hover:text-charcoal'}`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-plum/10 text-plum' : 'text-charcoal/40 hover:text-charcoal'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setSortOpen(!sortOpen)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blush/60 rounded-xl font-sans text-sm font-semibold text-charcoal hover:border-plum/40 hover:bg-cream transition-all duration-200 min-w-[190px] justify-between shadow-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-charcoal/50 font-normal">Sort by:</span>
                        {currentSortLabel}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-charcoal/50 transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {sortOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                        <div className="absolute right-0 mt-2 w-52 bg-white border border-blush rounded-2xl shadow-xl shadow-charcoal/10 z-20 overflow-hidden animate-fade-in-slide-down">
                          <div className="py-1.5">
                            {SORT_OPTIONS.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => {
                                  setSortBy(option.value);
                                  setSortOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 font-sans text-sm transition-colors duration-150 ${
                                  sortBy === option.value
                                    ? 'bg-plum/10 text-plum font-semibold'
                                    : 'text-charcoal hover:bg-cream'
                                }`}
                              >
                                {option.label}
                                {sortBy === option.value && <span className="float-right text-plum">✓</span>}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Active Category Badges (if any were passed via URL) */}
              {(filters.category || filters.search) && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {filters.category && (
                    <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-plum/10 text-plum text-xs font-sans font-semibold rounded-full border border-plum/20">
                      Category: {filters.category}
                      <button
                        onClick={() => dispatch(setFilters({ category: null }))}
                        className="hover:bg-plum/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.search && (
                    <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-gold/10 text-charcoal text-xs font-sans font-semibold rounded-full border border-gold/30">
                      Search: {filters.search}
                      <button
                        onClick={() => dispatch(setFilters({ search: null }))}
                        className="hover:bg-gold/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Products Grid / List */}
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-plum"></div>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-red-500 font-sans">{error}</p>
                </div>
              ) : displayedItems.length === 0 ? (
                <div className="text-center py-20 bg-white border border-blush/50 rounded-2xl">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cream flex items-center justify-center">
                    <svg className="w-8 h-8 text-charcoal/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-charcoal/60 font-sans font-medium">No products match your filters.</p>
                  <button onClick={handleClearAllFilters} className="mt-3 text-sm font-sans text-plum font-semibold hover:underline">
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className={`grid gap-6 ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'}`}>
                  {displayedItems.map((product) => (
                    <ProductCard key={product._id} product={product} viewMode={viewMode} />
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
