import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X } from "lucide-react";
import CategorySection from "../components/CategorySection";
import ProductCard from "../components/ProductCard";
import { products as localProducts, categories as localCategories } from "../data/products";

function Products() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");
  const mainCategory = searchParams.get("main");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [uniqueMaterials, setUniqueMaterials] = useState([]);

  // Extract unique materials and set initial products
  useEffect(() => {
    // Get unique materials from all products
    const materialsSet = new Set();
    localProducts.forEach(product => {
      product.composition?.forEach(comp => {
        if (comp.material) {
          materialsSet.add(comp.material.toLowerCase());
        }
      });
    });
    setUniqueMaterials(Array.from(materialsSet).sort());
    setFilteredProducts(localProducts);
  }, []);

  // Filter products when selection changes
  useEffect(() => {
    let result = [...localProducts];

    // Apply category filters
    if (mainCategory) {
      result = result.filter(product => product.category?.id === mainCategory);
      if (category) {
        result = result.filter(product => product.sub_category?.id === category);
      }
    }

    // Apply material filters
    if (selectedMaterials.length > 0) {
      result = result.filter(product =>
        product.composition?.some(comp =>
          selectedMaterials.includes(comp.material.toLowerCase())
        )
      );
    }

    setFilteredProducts(result);
  }, [category, mainCategory, selectedMaterials]);

  const handleMaterialChange = (material) => {
    setSelectedMaterials(prev =>
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };

  const getCurrentCategoryName = () => {
    if (!category && !mainCategory) return "All Products";
    const mainCat = localCategories.find(c => c.id === mainCategory);
    if (!category && mainCat) return mainCat.name;
    if (category && mainCat) {
      const subCat = mainCat.subcategories.find(s => s.id === category);
      return subCat ? subCat.name : mainCat.name;
    }
    return "Products";
  };

  return (
    <div className="min-h-screen p-14 bg-gray-50">
      {/* Header Section */}
      <div className="sticky top-0 z-40 bg-gray-50 shadow-sm">
        <CategorySection />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">{getCurrentCategoryName()}</h1>
          <p className="text-gray-600">{filteredProducts.length} products</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <aside className={`
            lg:block fixed lg:relative inset-0 z-50 lg:z-0 bg-white lg:bg-transparent
            transform transition-transform duration-300 ease-in-out
            ${isFilterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}>
            <div className="h-full lg:h-auto p-4 lg:p-0">
              <div className="flex justify-between items-center lg:hidden mb-4">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Materials Filter */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Materials</h3>
                <div className="space-y-3">
                  {uniqueMaterials.map((material) => (
                    <label key={material} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(material)}
                        onChange={() => handleMaterialChange(material)}
                        className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                      />
                      <span className="ml-2 text-gray-700 capitalize">
                        {material}
                        <span className="text-gray-400 text-sm ml-1">
                          ({localProducts.filter(p => 
                            p.composition?.some(c => 
                              c.material.toLowerCase() === material
                            )
                          ).length})
                        </span>
                      </span>
                    </label>
                  ))}
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
                <p className="mt-2 text-sm text-gray-500">Try adjusting your filters</p>
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
      {isFilterOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
}

export default Products;