import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X } from "lucide-react";
import CategorySection from "../components/CategorySection";
import ProductCard from "../components/ProductCard";

function Products() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");
  const mainCategory = searchParams.get("main");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    materials: [],
    categories: [],
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [apiProducts, setApiProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://patsons.pythonanywhere.com/api/products/");
        const data = await response.json();
        if (data.status === "success") {
          setApiProducts(data.products);
          setFilteredProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on all criteria
  useEffect(() => {
    let result = [...apiProducts];

    if (category) {
      result = result.filter((product) =>
        product.category.id === category ||
        product.category.subcategories.some(sub => sub.id === category)
      );
    }

    if (mainCategory) {
      result = result.filter((product) => product.category.id === mainCategory);
    }

    if (filters.materials.length > 0) {
      result = result.filter((product) =>
        product.composition.some((comp) => filters.materials.includes(comp.material))
      );
    }

    setFilteredProducts(result);
  }, [category, mainCategory, filters, apiProducts]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen p-14 bg-gray-50">
      {/* Header Section */}
      <div className="sticky top-0 z-40 bg-gray-50 shadow-sm">
        <CategorySection />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-600">{filteredProducts.length} products</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <aside className={`
            lg:block fixed lg:relative inset-0 z-50 lg:z-0
            transform transition-transform duration-300 ease-in-out
            ${isFilterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}>
            <div className="h-full lg:h-auto bg-white lg:bg-transparent p-4 lg:p-0">
              <div className="flex justify-between items-center lg:hidden mb-4">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Filter Content */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Materials</h3>
                  <div className="space-y-2">
                    {["Cotton", "Polyester", "Wool", "Denim", "Linen"].map((material) => (
                      <label key={material} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.materials.includes(material)}
                          onChange={(e) => {
                            const newMaterials = e.target.checked
                              ? [...filters.materials, material]
                              : filters.materials.filter((m) => m !== material);
                            handleFilterChange({ ...filters, materials: newMaterials });
                          }}
                          className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                        />
                        <span className="ml-2 text-gray-700">{material}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or search criteria</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <motion.button
        onClick={() => setIsFilterOpen(true)}
        className="fixed lg:hidden right-4 bottom-20 z-30 bg-black text-white p-4 rounded-full shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Filter className="w-6 h-6" />
        <span className="sr-only">Open Filters</span>
      </motion.button>

      {/* Mobile Filter Backdrop */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsFilterOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Products;