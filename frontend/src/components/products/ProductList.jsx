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
import { SlidersHorizontal, ChevronDown, X, ArrowUpDown } from 'lucide-react';

// Price range options
const PRICE_RANGES = [
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 – $50', min: 25, max: 50 },
  { label: '$50 – $100', min: 50, max: 100 },
  { label: '$100+', min: 100, max: Infinity },
];

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
  const [searchParams] = useSearchParams();
  const { items, categories, isLoading, error, filters } = useSelector((state) => state.products);
  const [searchInput, setSearchInput] = useState('');
  const [showLanding, setShowLanding] = useState(true);

  // New local filter/sort state
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null); // index into PRICE_RANGES or null
  const [showFilters, setShowFilters] = useState(false);

  // Read category AND search from URL params whenever the URL changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const searchFromUrl   = searchParams.get('search');
    if (categoryFromUrl || searchFromUrl) {
      dispatch(setFilters({
        category: categoryFromUrl || null,
        search:   searchFromUrl   || null,
      }));
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

  const handleClearAllFilters = () => {
    setSortBy('relevance');
    setSelectedPriceRange(null);
    dispatch(setFilters({ category: null, search: null }));
    setSearchInput('');
  };

  // Derive the selected sort label
  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Relevance';

  // Active filter/sort count (for badge)
  const activeFilterCount = [
    selectedPriceRange !== null,
    filters.category !== null && filters.category !== undefined,
    sortBy !== 'relevance',
  ].filter(Boolean).length;

  // Client-side sort + price filter applied on top of the fetched items
  const displayedItems = useMemo(() => {
    let result = [...items];

    // Price range filter
    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      result = result.filter(p => p.price >= range.min && p.price < range.max);
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'name_asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // relevance: keep server order
        break;
    }

    return result;
  }, [items, sortBy, selectedPriceRange]);

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
        <div id="products-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* ── Page Header ── */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold font-serif text-plum">
              {filters.category ? filters.category : 'All Products'}
            </h1>
            <p className="mt-1 text-charcoal/60 font-sans text-sm">
              {isLoading
                ? 'Loading...'
                : `${displayedItems.length} ${displayedItems.length === 1 ? 'product' : 'products'} found`}
            </p>
          </div>

          {/* ── Search Bar ── */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-5">
            <div className="relative flex-1">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                id="product-search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-blush rounded-xl font-sans text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-plum/30 focus:border-plum transition-all"
              />
            </div>
            <button
              type="submit"
              id="product-search-btn"
              className="px-5 py-2.5 bg-plum hover:bg-plum/90 text-white font-sans font-semibold text-sm rounded-xl transition-all active:scale-95 shadow-sm shadow-plum/20"
            >
              Search
            </button>
          </form>

          {/* ── Toolbar: Filter Toggle + Sort By ── */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

            {/* Left: Filter toggle button and All button */}
            <div className="flex items-center gap-3">
              <button
                id="toggle-filters-btn"
                onClick={() => setShowFilters(prev => !prev)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-sans text-sm font-semibold transition-all duration-200 ${
                  showFilters
                    ? 'bg-plum text-white border-plum shadow-sm'
                    : 'bg-white text-charcoal border-blush hover:border-plum/40 hover:bg-cream'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filter By
                {activeFilterCount > 0 && (
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold ${
                    showFilters ? 'bg-white text-plum' : 'bg-plum text-white'
                  }`}>
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <button
                id="clear-all-filters-btn"
                onClick={handleClearAllFilters}
                className="px-4 py-2 bg-white border border-blush hover:border-plum/40 hover:bg-cream text-charcoal font-sans text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm shadow-blush/20"
                aria-label="Clear all filters"
              >
                All
              </button>
            </div>

            {/* Right: Sort By dropdown */}
            <div className="relative">
              <button
                id="sort-by-btn"
                onClick={() => setSortOpen(prev => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blush rounded-xl font-sans text-sm font-semibold text-charcoal hover:border-plum/40 hover:bg-cream transition-all duration-200 min-w-[190px] justify-between"
              >
                <span className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-plum" />
                  {currentSortLabel}
                </span>
                <ChevronDown className={`w-4 h-4 text-charcoal/50 transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown menu */}
              {sortOpen && (
                <>
                  {/* backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSortOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-blush rounded-2xl shadow-xl shadow-charcoal/10 z-20 overflow-hidden animate-fade-in-slide-down">
                    <div className="py-1.5">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          id={`sort-${option.value}`}
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
                          {sortBy === option.value && (
                            <span className="float-right text-plum">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Expandable Filter Panel ── */}
          {showFilters && (
            <div className="mb-5 p-4 sm:p-5 bg-white border border-blush/60 rounded-2xl shadow-sm animate-fade-in-slide-down">
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-8">

                {/* Category filter */}
                <div className="flex-1">
                  <p className="font-sans text-xs font-bold text-charcoal/50 uppercase tracking-widest mb-3">
                    Category
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      id="filter-category-all"
                      onClick={() => handleCategoryChange('all')}
                      className={`px-3.5 py-1.5 rounded-full text-sm font-sans font-medium transition-all duration-200 border ${
                        !filters.category
                          ? 'bg-plum text-white border-plum shadow-sm'
                          : 'bg-white text-charcoal border-blush hover:border-plum/40 hover:bg-cream'
                      }`}
                    >
                      All
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        id={`filter-category-${category.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-3.5 py-1.5 rounded-full text-sm font-sans font-medium transition-all duration-200 border ${
                          filters.category === category
                            ? 'bg-plum text-white border-plum shadow-sm'
                            : 'bg-white text-charcoal border-blush hover:border-plum/40 hover:bg-cream'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px bg-blush/60 self-stretch" />
                <div className="sm:hidden h-px bg-blush/60" />

                {/* Price Range filter */}
                <div>
                  <p className="font-sans text-xs font-bold text-charcoal/50 uppercase tracking-widest mb-3">
                    Price Range
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_RANGES.map((range, idx) => (
                      <button
                        key={range.label}
                        id={`filter-price-${idx}`}
                        onClick={() => setSelectedPriceRange(selectedPriceRange === idx ? null : idx)}
                        className={`px-3.5 py-1.5 rounded-full text-sm font-sans font-medium transition-all duration-200 border ${
                          selectedPriceRange === idx
                            ? 'bg-gold text-white border-gold shadow-sm'
                            : 'bg-white text-charcoal border-blush hover:border-gold/50 hover:bg-cream'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear all filters */}
              {activeFilterCount > 0 && (
                <div className="mt-4 pt-4 border-t border-blush/40">
                  <button
                    id="clear-all-filters-btn"
                    onClick={handleClearAllFilters}
                    className="inline-flex items-center gap-1.5 text-sm font-sans text-charcoal/60 hover:text-plum transition-colors duration-200"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Active Filter Pills (always visible when filters active) ── */}
          {(filters.category || selectedPriceRange !== null || sortBy !== 'relevance') && (
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="text-xs font-sans text-charcoal/50 font-medium">Active:</span>

              {filters.category && (
                <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-plum/10 text-plum text-xs font-sans font-semibold rounded-full border border-plum/20">
                  {filters.category}
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className="hover:bg-plum/20 rounded-full p-0.5 transition-colors"
                    aria-label="Remove category filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedPriceRange !== null && (
                <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-gold/10 text-charcoal text-xs font-sans font-semibold rounded-full border border-gold/30">
                  {PRICE_RANGES[selectedPriceRange].label}
                  <button
                    onClick={() => setSelectedPriceRange(null)}
                    className="hover:bg-gold/20 rounded-full p-0.5 transition-colors"
                    aria-label="Remove price filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {sortBy !== 'relevance' && (
                <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-cream text-charcoal text-xs font-sans font-semibold rounded-full border border-blush">
                  ↕ {currentSortLabel}
                  <button
                    onClick={() => setSortBy('relevance')}
                    className="hover:bg-blush/60 rounded-full p-0.5 transition-colors"
                    aria-label="Remove sort"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* ── Products Grid ── */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-plum"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 font-sans">{error}</p>
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cream flex items-center justify-center">
                <svg className="w-8 h-8 text-charcoal/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-charcoal/60 font-sans font-medium">No products match your filters.</p>
              <button
                onClick={handleClearAllFilters}
                className="mt-3 text-sm font-sans text-plum hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedItems.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
