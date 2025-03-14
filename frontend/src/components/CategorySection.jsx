import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { fetchAllCategories } from "../data/products";

function CategorySection() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeCategory = searchParams.get("category");
  const activeMainCategory = searchParams.get("main");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAllCategories();
        console.log('Raw categories data:', data);

        // Handle both array and object response formats
        const categoriesData = Array.isArray(data) ? data : data.categories || [];
        console.log('Processed categories data:', categoriesData);

        if (categoriesData.length === 0) {
          setError('No categories found');
        } else {
          setCategories(categoriesData);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
        setError(err.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);
  console.log(categories);

  // Automatically expand the category if there's an active main category
  useEffect(() => {
    if (activeMainCategory) {
      setExpandedCategory(activeMainCategory);
      setIsCategoryExpanded(true);
    }
  }, [activeMainCategory]);

  // Handle category click to navigate to the products page with updated query parameters
  const handleMainCategoryClick = (categoryId, event) => {
    if (!event.target.closest("button")) {
      // Only navigate if not clicking the expand/collapse button
      navigate(`/products?main=${categoryId}`);
      setExpandedCategory(categoryId);
      setIsCategoryExpanded(false); // Close mobile menu after selection
    }
  };

  // Handle subcategory selection to set category and main category in the URL
  const handleSubcategoryClick = (mainCategoryId, subCategoryId) => {
    // Update the URL parameters to reflect the selected subcategory
    navigate(`/products?main=${mainCategoryId}&category=${subCategoryId}`);
    setIsCategoryExpanded(false); // Close mobile menu after selection
    setExpandedCategory(null); // Reset expanded state
  };

  const toggleCategory = (category, event) => {
    event.stopPropagation();
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  if (loading) {
    return (
      <div className="bg-white md:bg-transparent p-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white md:bg-transparent p-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <section className="bg-white md:bg-transparent">
      {/* Mobile View - Sticky */}
      <div className="md:hidden">
        <button
          onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
          className="w-full px-4 py-3 mt-3 flex items-center justify-between border-b"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Shop by Category</h2>
            {(activeCategory || activeMainCategory) && (
              <span className="text-sm text-sky-600">
                (
                {activeCategory
                  ? categories.find(
                      (category) => category.id === activeMainCategory
                    )?.subcategories?.find((sub) => sub.id === activeCategory)
                      ?.name
                  : categories.find((category) => category.id === activeMainCategory)
                      ?.name}
                )
              </span>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${isCategoryExpanded ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {isCategoryExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden bg-gray-50"
            >
              <div className="p-4 space-y-2">
                <Link
                  to="/products"
                  className={`
                    block rounded-lg p-3 border transition-all bg-white
                    ${!activeMainCategory && !activeCategory ? "border-sky-500 bg-sky-50" : "border-gray-200"}`}
                >
                  <span className="font-medium">All Products</span>
                </Link>

                {categories.map((category) => (
                  <div key={category.id}>
                    <div
                      onClick={(e) => handleMainCategoryClick(category.id, e)}
                      className={`rounded-lg border transition-all bg-white ${activeMainCategory === category.id ? "border-sky-500" : "border-gray-200"}`}
                    >
                      <div className="p-3 flex items-center justify-between">
                        <span className={`font-medium ${activeMainCategory === category.id ? "text-sky-600" : ""}`}>
                          {category.name}
                        </span>
                        <button
                          onClick={(e) => toggleCategory(category.id, e)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {expandedCategory === category.id ? (
                            <ChevronDown className={`w-4 h-4 ${activeMainCategory === category.id ? "text-sky-600" : ""}`} />
                          ) : (
                            <ChevronRight className={`w-4 h-4 ${activeMainCategory === category.id ? "text-sky-600" : ""}`} />
                          )}
                        </button>
                      </div>

                      <AnimatePresence>
                        {expandedCategory === category.id && category.subcategories && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t divide-y divide-gray-100">
                              {category.subcategories.map((sub) => (
                                <Link
                                  key={sub.id}
                                  to="#"
                                  onClick={() => handleSubcategoryClick(category.id, sub.id)}
                                  className={`flex items-center gap-3 px-4 py-2.5
                                    ${activeCategory === sub.id ? "bg-sky-50 text-sky-600 font-medium" : "hover:bg-gray-100"}`}
                                >
                                  <span>{sub.name}</span>
                                  {activeCategory === sub.id && (
                                    <ChevronRight className="w-4 h-4 ml-auto text-sky-600" />
                                  )}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block bg-transparent">
        <div className="container mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* All Products Category */}
            <div className="relative">
              <div
                onClick={() => navigate("/products")}
                className={`rounded-xl overflow-hidden transition-all duration-300 cursor-pointer
                  ${!activeMainCategory && !activeCategory ? "ring-2 ring-sky-500" : ""} bg-white`}
              >
                <div className="relative">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src="/placeholder.svg"
                      alt="All Products"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="w-full px-4 py-3 flex items-center justify-between backdrop-blur-sm absolute bottom-0 left-0 right-0">
                    <span className="font-semibold text-gray-800">All Products</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Categories */}
            {categories.map((category) => (
              <div key={category.id} className="relative">
                <div
                  onClick={(e) => handleMainCategoryClick(category.id, e)}
                  className={`rounded-xl overflow-hidden transition-all duration-300 cursor-pointer
                    ${expandedCategory === category.id ? "shadow-lg" : "shadow hover:shadow-lg"}
                    ${activeMainCategory === category.id ? "ring-2 ring-sky-500" : ""} bg-white`}
                >
                  <div className="relative">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img
                        src={category.image ? `http://127.0.0.1:8000${category.image}` : "/placeholder.svg"}
                        alt={category.name}
                        className={`w-full h-full object-cover transition-transform duration-300
                          ${activeMainCategory === category.id ? "scale-105" : "group-hover:scale-105"}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <button
                      onClick={(e) => toggleCategory(category.id, e)}
                      className={`w-full px-4 py-3 flex items-center justify-between
                        bg-white/90 backdrop-blur-sm hover:bg-white/95 transition-colors
                        absolute bottom-0 left-0 right-0
                        ${activeMainCategory === category.id ? "bg-sky-50" : ""}`}
                    >
                      <span className="font-semibold text-gray-800">{category.name}</span>
                      {expandedCategory === category.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Subcategories Panel - Desktop */}
                <AnimatePresence>
                  {expandedCategory === category.id && category.subcategories && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute z-20 w-full bg-white rounded-lg shadow-lg mt-3 overflow-hidden"
                    >
                      <div className="divide-y divide-gray-100">
                        {category.subcategories.map((sub) => (
                          <div
                            key={sub.id}
                            onClick={() => handleSubcategoryClick(category.id, sub.id)}
                            className={`block px-4 py-2.5 hover:bg-gray-100 cursor-pointer
                              ${activeCategory === sub.id ? "bg-sky-50 text-sky-600 font-semibold" : ""}`}
                          >
                            {sub.name}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategorySection; 