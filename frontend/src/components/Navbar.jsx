import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, ShoppingBag, ChevronDown } from 'lucide-react';
import { useInquiry } from '../context/InquiryContext';
import CartPreview from './CartPreview';

const routes = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products", hasDropdown: true },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

// Demo products for search - in real app, this would come from your database
const searchProducts = [
  {
    id: 1,
    name: "Classic Knit Sweater",
    category: "mens-sweater",
    image: "/placeholder.svg",
    price: 89.99,
    styleNumber: "MS2023-001",
  },
  {
    id: 2,
    name: "V-Neck T-Shirt",
    category: "mens-tshirt",
    image: "/placeholder.svg",
    price: 29.99,
    styleNumber: "MT2023-001",
  },
  {
    id: 3,
    name: "Ladies Denim Jacket",
    category: "ladies-jacket",
    image: "/placeholder.svg",
    price: 129.99,
    styleNumber: "LJ2023-001",
  },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { inquiryItems } = useInquiry();
  const cartCount = inquiryItems.length;
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = localStorage.getItem('access_token');

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.styleNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://patsons.pythonanywhere.com/api/categories/');
        const data = await response.json();
        if (data.status === "success") {
          setCategories(data.categories);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleLogout = async () => {
    try {
      const refresh_token = localStorage.getItem('refresh_token');
      
      const response = await fetch('http://127.0.0.1:8000/api/accounts/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ refresh: refresh_token }),
      });

      if (response.ok) {
        // Clear tokens from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        // Redirect to home page
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
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
            <Link to="/" className="text-2xl font-bold">
              Patson's
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
                            {categories.map(category => (
                              <div key={category.id} className="px-4 py-2">
                                <Link
                                  to={`/products?main=${category.id}`}
                                  className="text-sm font-semibold text-gray-900 hover:text-sky-600"
                                >
                                  {category.name}
                                </Link>
                                <div className="mt-2 space-y-1">
                                  {category.subcategories.map(sub => (
                                    <Link
                                      key={sub.id}
                                      to={`/products?category=${sub.id}&main=${category.id}`}
                                      className="block text-sm text-gray-600 hover:text-sky-600 hover:bg-sky-100 px-2 py-1 rounded"
                                    >
                                      {sub.name}
                                    </Link>
                                  ))}
                                </div>
                                <div className="mt-2 border-t border-gray-100" />
                              </div>
                            ))}
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
            </nav>

            {/* Right section */}
            <div className="flex items-center space-x-4">
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
              <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700"
                  >
                    Logout
                  </button>
                ) : (
                  <Link to="/admin" className="text-sm font-semibold leading-6 text-gray-900">
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed inset-0 bg-white z-50 lg:hidden"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className="block py-3 text-lg hover:text-sky-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {route.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 mt-4 pt-4">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-3 text-lg hover:text-sky-600"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/admin"
                    className="block py-3 text-lg hover:text-sky-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Login
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
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
                          <p className="text-sm text-gray-600">{product.styleNumber}</p>
                          
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