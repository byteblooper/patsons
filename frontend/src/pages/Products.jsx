import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X } from "lucide-react";
import CategorySection from "../components/CategorySection";
import ProductCard from "../components/ProductCard";
import { 
  fetchAllProducts, 
  fetchAllCategories, 
  fetchCategoryProducts, 
  fetchSubcategoryProducts 
} from "../data/products";

function Products() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get("category");
  const mainCategoryId = searchParams.get("main");
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [uniqueMaterials, setUniqueMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch products based on category/subcategory selection
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        let data;

        console.log('Fetching products with:', { mainCategoryId, categoryId }); // Debug log

        if (mainCategoryId && categoryId) {
          // Fetch products for specific subcategory
          data = await fetchSubcategoryProducts(mainCategoryId, categoryId);
        } else if (mainCategoryId) {
          // Fetch products for main category
          data = await fetchCategoryProducts(mainCategoryId);
        } else {
          // Fetch all products
          data = await fetchAllProducts();
        }

        console.log('Raw products data:', data); // Debug log

        // Handle both array and object response formats
        const productsData = Array.isArray(data) ? data : data.products || [];
        console.log('Processed products data:', productsData); // Debug log

        if (productsData.length === 0) {
          setError('No products found for this category');
          setProducts([]);
          setFilteredProducts([]);
        } else {
          setProducts(productsData);
          setFilteredProducts(productsData);

          // Extract unique materials
          const materialsSet = new Set();
          productsData.forEach(product => {
            if (Array.isArray(product.composition)) {
              product.composition.forEach(comp => {
                if (comp.material) {
                  materialsSet.add(comp.material.toLowerCase());
                }
              });
            }
          });
          setUniqueMaterials(Array.from(materialsSet).sort());
        }
      } catch (err) {
        console.error('Error loading products:', err);
        setError(err.message || 'Failed to load products');
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [mainCategoryId, categoryId]);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchAllCategories();
        console.log('Raw categories data:', data); // Debug log

        // Handle both array and object response formats
        const categoriesData = Array.isArray(data) ? data : data.categories || [];
        console.log('Processed categories data:', categoriesData); // Debug log

        if (categoriesData.length === 0) {
          console.warn('No categories found');
        }
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load categories');
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  // Filter products when material selection changes
  useEffect(() => {
    if (selectedMaterials.length === 0) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      product.composition?.some(comp =>
        selectedMaterials.includes(comp.material.toLowerCase())
      )
    );
    setFilteredProducts(filtered);
  }, [selectedMaterials, products]);

  const handleMaterialChange = (material) => {
    setSelectedMaterials(prev =>
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };

  const getCurrentCategoryName = () => {
    if (!categoryId && !mainCategoryId) return "All Products";
    const mainCat = categories.find(c => c.id === mainCategoryId);
    if (!categoryId && mainCat) return mainCat.name;
    if (categoryId && mainCat) {
      const subCat = mainCat.subcategories?.find(s => s.id === categoryId);
      return subCat ? subCat.name : mainCat.name;
    }
    return "Products";
  };

  return (
    <div className="min-h-screen p-14 bg-gray-50">
      {/* Header Section */}
      <div className="sticky top-0 z-40 bg-gray-50 shadow-sm">
        <CategorySection categories={categories} />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">{getCurrentCategoryName()}</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <p className="text-gray-600">{filteredProducts.length} products</p>
          </div>
        </div>

        {error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Filter Sidebar */}
            <aside className={`
              fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
              lg:relative lg:translate-x-0 lg:w-64 lg:shadow-none
              ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
              <div className="h-full overflow-auto p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Materials Filter */}
                {uniqueMaterials.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-4">Materials</h3>
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
                              ({products.filter(p => 
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
                )}
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;