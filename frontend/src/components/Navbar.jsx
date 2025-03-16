import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, ShoppingBag, ChevronDown, LogOut } from 'lucide-react';
import { useInquiry } from '../context/InquiryContext';
import CartPreview from './CartPreview';
import { fetchAllCategories, fetchAllProducts } from '../data/products';
import BaseUrl from '../data/ApiUrl';

const routes = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products", hasDropdown: true },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [products, setProducts] = useState([]);
  const { inquiryItems } = useInquiry();
  const cartCount = inquiryItems.length;
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin by looking for access_token
    const accessToken = localStorage.getItem('access_token');
    setIsAdmin(!!accessToken);
  }, []);

  // Load products for search
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchAllProducts();
        const productsArray = Array.isArray(data) ? data : data.products || [];
        setProducts(productsArray);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    loadProducts();
  }, []);

  const handleLogout = async () => {
    try {
      const refresh_token = localStorage.getItem('refresh_token');
      
      const response = await fetch(`${BaseUrl}/api/accounts/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ refresh: refresh_token }),
      });

      if (response.ok) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setIsAdmin(false);
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = products.filter(
        (product) => product.style_number?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, products]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchAllCategories();
        console.log('Raw categories data:', data);
        
        // Handle both array and object response formats
        const categoriesData = Array.isArray(data) ? data : data.categories || [];
        console.log('Processed categories data:', categoriesData);
        
        if (categoriesData.length === 0) {
          console.error('No categories found');
        } else {
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryClick = (categoryId, e) => {
    e.preventDefault();
    navigate(`/products?main=${categoryId}`);
    setIsProductsOpen(false);
  };

  const handleSubcategoryClick = (categoryId, subcategoryId, e) => {
    e.preventDefault();
    navigate(`/products?main=${categoryId}&category=${subcategoryId}`);
    setIsProductsOpen(false);
  };

  return (
    <>
      <div className="bg-white fixed border-b-[0.1rem] border-gray-200 w-full top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-full">
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center pl-4">
              <img src="/public/logo-light.svg" alt="Patson's Logo" className="h-12" />
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {routes.map((route) => (
                <div key={route.path} className="relative">
                  {route.hasDropdown ? (
                    <div onMouseEnter={() => setIsProductsOpen(true)} onMouseLeave={() => setIsProductsOpen(false)}>
                      <button
                        className={`
                          flex items-center gap-1 py-2 text-sm font-medium transition-colors
                          ${location.pathname.startsWith(route.path) ? "text-sky-600" : "text-gray-700 hover:text-sky-600"}
                        `}
                      >
                        {route.name}
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      <AnimatePresence>
                        {isProductsOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-4 flex w-[40rem]"
                          >
                            <div className="grid grid-cols-3 gap-4 w-full px-4">
                              <div className="col-span-3">
                                <Link
                                  to="/products"
                                  className="block px-4 py-2 text-sm font-semibold text-gray-900 hover:text-sky-600 hover:bg-sky-50 rounded-md"
                                  onClick={() => setIsProductsOpen(false)}
                                >
                                  All Products
                                </Link>
                                <div className="border-t my-2"></div>
                              </div>
                              {categories.map(category => (
                                <div key={category.id} className="space-y-2">
                                  <Link
                                    to={`/products?main=${category.id}`}
                                    className="block px-4 py-2 text-sm font-semibold text-gray-900 hover:text-sky-600 hover:bg-sky-50 rounded-md"
                                    onClick={(e) => handleCategoryClick(category.id, e)}
                                  >
                                    {category.name}
                                  </Link>
                                  <div className="space-y-1">
                                    {category.subcategories?.map(sub => (
                                      <Link
                                        key={sub.id}
                                        to={`/products?main=${category.id}&category=${sub.id}`}
                                        className="block px-6 py-1 text-sm text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-md"
                                        onClick={(e) => handleSubcategoryClick(category.id, sub.id, e)}
                                      >
                                        {sub.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={route.path}
                      className={`
                        relative py-2 text-sm font-medium transition-colors
                        ${location.pathname === route.path ? "text-sky-600" : "text-gray-700 hover:text-sky-600"}
                      `}
                    >
                      {route.name}
                      {location.pathname === route.path && (
                        <motion.div
                          layoutId="navbar-underline"
                          className="absolute left-0 right-0 bottom-0 h-0.5 bg-sky-600"
                        />
                      )}
                    </Link>
                  )}
                </div>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`
                    relative py-2 text-sm font-medium transition-colors
                    ${location.pathname === "/admin" ? "text-sky-600" : "text-gray-700 hover:text-sky-600"}
                  `}
                >
                  Admin
                  {location.pathname === "/admin" && (
                    <motion.div
                      layoutId="navbar-underline"
                      className="absolute left-0 right-0 bottom-0 h-0.5 bg-sky-600"
                    />
                  )}
                </Link>
              )}
            </nav>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              {!location.pathname.startsWith('/admin') && (
                <>
                  <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:bg-gray-100 rounded-full">
                    <Search className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setIsCartOpen(!isCartOpen)} 
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </button>
                    <AnimatePresence>
                      {isCartOpen && <CartPreview isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
                    </AnimatePresence>
                  </div>
                </>
              )}
              {isAdmin && location.pathname.startsWith('/admin') && (
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0.5 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                mass: 0.8
              }}
              className="fixed left-0 top-0 bottom-0 w-[15rem] md:w-[33.333333%] bg-white z-50 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="p-5 overflow-y-auto max-h-[calc(100vh-5rem)]">
                {routes.map((route) => (
                  <div key={route.path} className="mb-2">
                    {route.hasDropdown ? (
                      <>
                        <button
                          onClick={() => setIsProductsOpen(!isProductsOpen)}
                          className="w-full flex items-center justify-between py-3 text-lg text-gray-700 hover:text-sky-600 transition-colors duration-200"
                        >
                          {route.name}
                          <ChevronDown 
                            className={`w-5 h-5 transform transition-transform duration-300 ${
                              isProductsOpen ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                        <AnimatePresence>
                          {isProductsOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden ml-4 border-l border-gray-100"
                            >
                              <Link
                                to="/products"
                                className="block py-2.5 pl-4 text-gray-600 hover:text-sky-600 transition-colors duration-200"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                All Products
                              </Link>
                              {categories.map(category => (
                                <div key={category.id} className="mb-3">
                                  <Link
                                    to={`/products?main=${category.id}`}
                                    className="block py-2.5 pl-4 font-medium text-gray-800 hover:text-sky-600 transition-colors duration-200"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {category.name}
                                  </Link>
                                  <div className="space-y-1">
                                    {category.subcategories?.map(sub => (
                                      <Link
                                        key={sub.id}
                                        to={`/products?main=${category.id}&category=${sub.id}`}
                                        className="block py-2 pl-8 text-sm text-gray-600 hover:text-sky-600 transition-colors duration-200"
                                        onClick={() => setMobileMenuOpen(false)}
                                      >
                                        {sub.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={route.path}
                        className="block py-3 text-lg text-gray-700 hover:text-sky-600 transition-colors duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {route.name}
                      </Link>
                    )}
                  </div>
                ))}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block py-3 text-lg text-gray-700 hover:text-sky-600 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                {isAdmin && location.pathname.startsWith('/admin') && (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left py-3 text-lg text-red-600 hover:text-red-700 transition-colors duration-200"
                  >
                    Logout
                  </button>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black/50 z-50"
          >
            <div className="bg-white w-full max-w-3xl mx-auto mt-20 rounded-lg shadow-xl">
              <div className="p-4 border-b flex items-center">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 outline-none text-lg"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-auto">
                {searchResults.length > 0 ? (
                  <div className="p-4 space-y-4">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="w-16 h-16 relative rounded overflow-hidden bg-gray-100">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.style_number}</p>
                          
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="p-8 text-center text-gray-500">No products found</div>
                ) : (
                  <div className="p-8 text-center text-gray-500">Start typing to search products</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-[4.5rem]" />
    </>
  );
}

export default Navbar;