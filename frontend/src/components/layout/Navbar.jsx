import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/authSlice.js';
import { selectCartItemCount } from '@/features/cartSlice.js';
import { fetchRefundCount } from '@/features/refundsSlice.js';
import { fetchOrderCount } from '@/features/adminOrdersSlice.js';
import { fetchReturnsCount } from '@/features/returnsSlice.js';

const categoryData = {
  Dog: [
    { name: 'Collars & Harnesses', links: ['Velvet Collars', 'Leather Collars', 'Reflective Collars', 'Harness Sets'] },
    { name: 'Leashes & Leads', links: ['Leather Leashes', 'Rope Leashes', 'Retractable Leashes', 'Training Leashes'] },
    { name: 'Night Walk', links: ['LED Collars', 'LED Leashes', 'Glow Accessories', 'Night Walk Sets'] },
    { name: 'Playtime', links: ['Tug Toys', 'Chew Toys', 'Fetch Toys', 'Interactive Toys'] },
    { name: 'Accessories', links: ['Bandanas & Bow Ties', 'Tags & Charms', 'Poop Bags', 'Travel Bowls'] }
  ],
  Cat: [
    { name: 'Collars & Harnesses', links: ['Breakaway Collars', 'Velvet Collars', 'Escape-Proof Harness', 'Kitten Collars'] },
    { name: 'Leashes & Leads', links: ['Cat Leashes', 'Walking Harnesses', 'Retractable Leads'] },
    { name: 'Playtime', links: ['Feather Wands', 'Laser Toys', 'Catnip Toys', 'Interactive Puzzles'] },
    { name: 'Accessories', links: ['Cat Bow Ties', 'Bell Collars', 'Grooming Brushes', 'Cat Beds'] }
  ]
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Dog');
  const [expandedPet, setExpandedPet] = useState(null);
  
  const searchInputRef = useRef(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartItemCount = useSelector(selectCartItemCount);
  const { pendingCount } = useSelector((state) => state.refunds);
  const { pendingOrderCount } = useSelector((state) => state.adminOrders);
  const { count: pendingReturnsCount } = useSelector((state) => state.returns);

  // Poll for counts if admin
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      dispatch(fetchRefundCount());
      dispatch(fetchOrderCount('confirmed'));
      dispatch(fetchReturnsCount());
      
      const interval = setInterval(() => {
        dispatch(fetchRefundCount());
        dispatch(fetchOrderCount('confirmed'));
        dispatch(fetchReturnsCount());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user, dispatch]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white fixed top-0 left-0 right-0 z-[60] shadow-sm border-b border-blush/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center z-10 shrink-0">
            <img
              src="/logo/Color logo - no background rect.svg"
              alt="The Velvet Tails"
              className="h-12 w-auto"
            />
          </Link>

          {/* Right Side Group (Nav Links + Actions) */}
          <div className="flex items-center space-x-4 lg:space-x-8">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
            
            <Link to="/" className={`py-6 px-2 text-sm font-sans font-semibold inline-flex items-center transition-colors ${location.pathname === '/' ? 'text-plum' : 'text-charcoal hover:text-plum'}`}>
              Home
            </Link>

            <Link to="/about" className={`py-6 px-2 text-sm font-sans font-semibold inline-flex items-center transition-colors ${location.pathname === '/about' ? 'text-plum' : 'text-charcoal hover:text-plum'}`}>
              About
            </Link>

            {/* Products Mega Dropdown */}
            <div className="relative group">
              <Link to="/products" className={`py-6 px-2 text-sm font-sans font-semibold inline-flex items-center transition-colors ${location.pathname.startsWith('/products') ? 'text-plum' : 'text-charcoal hover:text-plum'}`}>
                Products
                <svg className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              
              {/* Dropdown Content */}
              <div className="absolute top-[100%] left-1/2 transform -translate-x-1/2 w-[700px] bg-white rounded-2xl shadow-xl shadow-plum/15 border border-blush opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 animate-fade-in-slide-down origin-top">
                {/* Tabs */}
                <div className="flex border-b border-blush">
                  {['Dog', 'Cat'].map(pet => (
                    <button
                      key={pet}
                      className={`flex-1 py-3 text-center font-serif font-semibold text-lg transition-colors ${activeTab === pet ? 'text-plum border-b-2 border-plum' : 'text-charcoal/70 hover:text-plum hover:bg-blush/10'}`}
                      onMouseEnter={() => setActiveTab(pet)}
                    >
                      {pet}
                    </button>
                  ))}
                </div>
                
                {/* Columns */}
                <div className="p-6 grid grid-cols-3 gap-6">
                  {categoryData[activeTab].map(col => (
                    <div key={col.name} className="flex flex-col space-y-3">
                      <h4 className="font-sans font-semibold text-sm text-charcoal flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold mr-2"></span>
                        {col.name}
                      </h4>
                      <ul className="space-y-2">
                        {col.links.map(link => (
                          <li key={link}>
                            <Link to={`/products?category=${encodeURIComponent(link)}`} className="text-sm text-charcoal/70 hover:text-plum transition-colors font-sans block">
                              {link}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                {/* Bottom CTA */}
                <div className="bg-blush/20 p-4 rounded-b-2xl text-center">
                  <Link to="/products" className="text-sm font-sans font-semibold text-plum hover:text-plum/80 inline-flex items-center">
                    View All {activeTab} Products
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <Link to="/contact" className={`py-6 px-2 text-sm font-sans font-semibold inline-flex items-center transition-colors ${location.pathname === '/contact' ? 'text-plum' : 'text-charcoal hover:text-plum'}`}>
              Contact
            </Link>

            {/* Admin Links */}
            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Link to="/admin/orders" className="text-charcoal hover:text-plum px-2 py-2 text-sm font-sans font-medium relative inline-flex items-center">
                  Orders {pendingOrderCount > 0 && <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold text-white bg-plum rounded-full">{pendingOrderCount}</span>}
                </Link>
                <Link to="/admin/refunds" className="text-charcoal hover:text-plum px-2 py-2 text-sm font-sans font-medium relative inline-flex items-center">
                  Refunds {pendingCount > 0 && <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-600 rounded-full">{pendingCount}</span>}
                </Link>
                <Link to="/admin/returns" className="text-charcoal hover:text-plum px-2 py-2 text-sm font-sans font-medium relative inline-flex items-center">
                  Returns {pendingReturnsCount > 0 && <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold text-white bg-amber-500 rounded-full">{pendingReturnsCount}</span>}
                </Link>
                <div className="relative group">
                  <button className="text-charcoal hover:text-plum px-2 py-6 text-sm font-sans font-medium inline-flex items-center">
                    Admin <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <div className="absolute left-0 top-[100%] mt-0 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link to="/admin/products" className="block px-4 py-2 text-sm font-sans text-charcoal hover:bg-blush/20 hover:text-plum">Products</Link>
                      <Link to="/admin/discounts" className="block px-4 py-2 text-sm font-sans text-charcoal hover:bg-blush/20 hover:text-plum">Discounts</Link>
                      <Link to="/admin/tax" className="block px-4 py-2 text-sm font-sans text-charcoal hover:bg-blush/20 hover:text-plum">Tax Settings</Link>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* User Links */}
            {isAuthenticated && user?.role !== 'admin' && (
              <Link to="/orders" className="text-charcoal hover:text-plum px-2 py-2 text-sm font-sans font-medium">
                My Orders
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            
            {/* Search Toggle */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-charcoal hover:text-plum transition-colors rounded-full hover:bg-blush/20"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isSearchOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                )}
              </svg>
            </button>

            {/* Auth / User */}
            <div className="hidden lg:flex items-center">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-sans text-charcoal flex items-center">
                    {user?.name}
                    {user?.role === 'admin' && <span className="ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-plum/10 text-plum">Admin</span>}
                  </span>
                  <button onClick={handleLogout} className="text-sm font-sans font-medium text-charcoal hover:text-plum">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="text-sm font-sans font-medium text-charcoal hover:text-plum px-2">Login</Link>
                  <Link to="/register" className="text-sm font-sans font-medium text-white bg-plum px-4 py-2 rounded-full hover:bg-plum/90 transition-all active:scale-[0.97]">Sign Up</Link>
                </div>
              )}
            </div>

            {/* Cart Icon (Persistent) */}
            {(!isAuthenticated || user?.role !== 'admin') && (
              <Link to="/cart" className="p-2 text-charcoal hover:text-plum transition-colors rounded-full hover:bg-blush/20 relative group">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-plum group-hover:scale-110 transition-transform">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-charcoal hover:text-plum transition-colors rounded-full hover:bg-blush/20 relative"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
              {user?.role === 'admin' && (pendingOrderCount > 0 || pendingCount > 0 || pendingReturnsCount > 0) && !mobileMenuOpen && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>
            
          </div>
          {/* End Right Side Group */}
          </div>
        </div>
      </div>

      {/* Search Dropdown */}
      {isSearchOpen && (
        <>
          <div className="absolute top-full left-0 right-0 bg-white border-b border-blush shadow-lg z-50 animate-fade-in-slide-down">
            <div className="max-w-3xl mx-auto p-4 sm:p-6">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-blush/50 rounded-xl font-sans text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-plum focus:ring-0 transition-colors text-lg"
                />
                <svg className="w-6 h-6 text-charcoal/40 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {/* Auto-suggest dropdown could go here, triggered by searchQuery length */}
              </form>
            </div>
          </div>
          {/* Backdrop for search */}
          <div className="fixed inset-0 top-16 bg-charcoal/20 backdrop-blur-sm z-40" onClick={() => setIsSearchOpen(false)}></div>
        </>
      )}

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-[65] transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-y-0 right-0 w-[85vw] sm:w-96 bg-white shadow-2xl z-[70] overflow-y-auto animate-slide-in-right flex flex-col">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-blush/30 shrink-0">
            <span className="font-serif font-bold text-lg text-plum">Menu</span>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-charcoal hover:text-plum rounded-full hover:bg-blush/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="px-4 py-6 space-y-6 flex-1 overflow-y-auto">
            
            {/* Mobile Main Links */}
            <div className="mb-4 space-y-1">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md font-sans font-semibold transition-colors ${location.pathname === '/' ? 'text-plum bg-blush/20' : 'text-charcoal hover:bg-blush/20'}`}>
                Home
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md font-sans font-semibold transition-colors ${location.pathname === '/about' ? 'text-plum bg-blush/20' : 'text-charcoal hover:bg-blush/20'}`}>
                About
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md font-sans font-semibold transition-colors ${location.pathname === '/contact' ? 'text-plum bg-blush/20' : 'text-charcoal hover:bg-blush/20'}`}>
                Contact
              </Link>
            </div>

            {/* Mobile Shop by Pet Accordion */}
            <div className="mb-4">
              <div className="px-3 py-2 text-xs font-bold text-charcoal/50 uppercase tracking-wider font-sans">Shop by Pet</div>
              
              {/* Dog Accordion */}
              <div className="border border-blush/50 rounded-xl mb-2 overflow-hidden">
                <button 
                  onClick={() => setExpandedPet(expandedPet === 'Dog' ? null : 'Dog')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-cream text-charcoal font-serif font-semibold"
                >
                  Dog Collection
                  <svg className={`w-5 h-5 transition-transform ${expandedPet === 'Dog' ? 'rotate-180 text-plum' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedPet === 'Dog' && (
                  <div className="px-4 py-2 bg-white space-y-4">
                    {categoryData.Dog.map(col => (
                      <div key={col.name} className="py-2 border-b border-blush/30 last:border-0">
                        <div className="font-sans font-semibold text-sm text-plum mb-2">{col.name}</div>
                        <div className="flex flex-col space-y-2 pl-2">
                          {col.links.map(link => (
                            <Link 
                              key={link} 
                              to={`/products?category=${encodeURIComponent(link)}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="text-sm font-sans text-charcoal/80"
                            >
                              {link}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-2 text-sm font-bold text-plum bg-blush/20 rounded-lg">
                      View All Dog Products
                    </Link>
                  </div>
                )}
              </div>

              {/* Cat Accordion */}
              <div className="border border-blush/50 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setExpandedPet(expandedPet === 'Cat' ? null : 'Cat')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-cream text-charcoal font-serif font-semibold"
                >
                  Cat Collection
                  <svg className={`w-5 h-5 transition-transform ${expandedPet === 'Cat' ? 'rotate-180 text-plum' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedPet === 'Cat' && (
                  <div className="px-4 py-2 bg-white space-y-4">
                    {categoryData.Cat.map(col => (
                      <div key={col.name} className="py-2 border-b border-blush/30 last:border-0">
                        <div className="font-sans font-semibold text-sm text-plum mb-2">{col.name}</div>
                        <div className="flex flex-col space-y-2 pl-2">
                          {col.links.map(link => (
                            <Link 
                              key={link} 
                              to={`/products?category=${encodeURIComponent(link)}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="text-sm font-sans text-charcoal/80"
                            >
                              {link}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-2 text-sm font-bold text-plum bg-blush/20 rounded-lg">
                      View All Cat Products
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Other Links */}
            <div className="px-3 py-2 text-xs font-bold text-charcoal/50 uppercase tracking-wider font-sans border-t border-blush/30 pt-4">Account & More</div>
            
            {isAuthenticated && user?.role === 'admin' && (
              <div className="space-y-1">
                <Link to="/admin/orders" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md font-sans font-medium text-charcoal hover:bg-blush/20">
                  Orders {pendingOrderCount > 0 && <span className="ml-2 px-2 py-0.5 text-xs font-bold text-white bg-plum rounded-full">{pendingOrderCount}</span>}
                </Link>
                <Link to="/admin/refunds" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md font-sans font-medium text-charcoal hover:bg-blush/20">
                  Refunds {pendingCount > 0 && <span className="ml-2 px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">{pendingCount}</span>}
                </Link>
                <Link to="/admin/returns" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md font-sans font-medium text-charcoal hover:bg-blush/20">
                  Returns {pendingReturnsCount > 0 && <span className="ml-2 px-2 py-0.5 text-xs font-bold text-white bg-amber-500 rounded-full">{pendingReturnsCount}</span>}
                </Link>
                <Link to="/admin/products" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md font-sans font-medium text-charcoal hover:bg-blush/20">Products</Link>
                <Link to="/admin/discounts" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md font-sans font-medium text-charcoal hover:bg-blush/20">Discounts</Link>
                <Link to="/admin/tax" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md font-sans font-medium text-charcoal hover:bg-blush/20">Tax Settings</Link>
              </div>
            )}

            {isAuthenticated && user?.role !== 'admin' && (
              <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md font-sans font-medium text-charcoal hover:bg-blush/20">
                My Orders
              </Link>
            )}

            {isAuthenticated ? (
              <div className="pt-2">
                <div className="px-3 py-2 text-sm text-charcoal font-sans flex items-center">
                  {user?.name}
                  {user?.role === 'admin' && <span className="ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-plum/10 text-plum">Admin</span>}
                </div>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 font-sans font-medium text-charcoal hover:bg-blush/20 rounded-md">
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-2 space-y-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-center rounded-xl font-sans font-medium text-charcoal border border-charcoal/20">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-center rounded-xl font-sans font-medium text-white bg-plum">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
