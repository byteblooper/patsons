import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";

function CategorySection() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const activeCategory = searchParams.get("category");
  const activeMainCategory = searchParams.get("main");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://patsons.pythonanywhere.com/api/categories/");
        const data = await response.json();
        if (data.status === "success") {
          const formattedCategories = data.categories.map((category) => ({
            id: category.id,
            name: category.name,
            subcategories: category.subcategories.map((sub) => ({
              id: sub.id,
              name: sub.name,
              slug: sub.name.toLowerCase().replace(/\s+/g, "-"),
            })),
          }));
          setCategories(formattedCategories);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Automatically expand the category if there's an active main category
  useEffect(() => {
    if (activeMainCategory) {
      setExpandedCategory(activeMainCategory);
      setIsCategoryExpanded(true);
    }
  }, [activeMainCategory]);

  // Handle category click to navigate to the products page with updated query parameters
  const handleMainCategoryClick = (key, event) => {
    if (!event.target.closest("button")) {
      // Only navigate if not clicking the expand/collapse button
      navigate(`/products?category=${key}&main=${activeCategory || ""}`);
    }
  };

  // Handle subcategory selection to set category and main category in the URL
  const handleSubcategoryClick = (mainCategoryId, subCategoryId) => {
    // Update the URL parameters to reflect the selected subcategory
    navigate(`/products?category=${subCategoryId}&main=${mainCategoryId}`);
  };

  const toggleCategory = (category, event) => {
    event.stopPropagation();
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

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
                    )?.subcategories.find((sub) => sub.id === activeCategory)
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
                        {expandedCategory === category.id && (
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
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
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
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className={`w-full h-full object-cover transition-transform duration-300
                          ${activeMainCategory === category.id ? "scale-105" : "group-hover:scale-105"}`}
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

                {/* Subcategories Panel */}
                <AnimatePresence>
                  {expandedCategory === category.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-3"
                    >
                      <div className="border-t divide-y divide-gray-100">
                        {category.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            to={`/products?category=${category.id}&main=${sub.id}`}
                            className={`block px-4 py-2.5 hover:bg-gray-100
                              ${activeCategory === sub.id ? "bg-sky-50 text-sky-600 font-semibold" : ""}`}
                          >
                            {sub.name}
                          </Link>
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