import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

function Products() {
  const location = useLocation();
  const [selectedComposition, setSelectedComposition] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const compositions = ['Cotton', 'Polyester', 'Wool', 'Denim', 'Linen'];

  useEffect(() => {
    if (location.state?.selectedCategory) {
      setExpandedCategory(location.state.selectedCategory);
    }
    if (location.state?.selectedSubcategory) {
      setSelectedSubcategory(location.state.selectedSubcategory);
    }
  }, [location.state]);

  const handleCompositionChange = (composition) => {
    setSelectedComposition(prev => 
      prev.includes(composition)
        ? prev.filter(c => c !== composition)
        : [...prev, composition]
    );
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleSubcategoryClick = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shop by Category</h1>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <div className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-gray-100">
            <div className="h-48 flex items-center justify-center">
              <span className="text-xl font-semibold text-gray-700">All Products</span>
            </div>
          </div>
          
          {categories.map((category) => (
            <div key={category.id} className="relative">
              <div 
                className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => toggleCategory(category.id)}
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
                  <div className="text-white text-center">
                    <p className="font-semibold text-sm">{category.name}</p>
                    {expandedCategory === category.id ? (
                      <ChevronDownIcon className="h-5 w-5 mx-auto mt-2" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5 mx-auto mt-2" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Dropdown Menu */}
              {expandedCategory === category.id && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg overflow-hidden">
                  {category.subcategories.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${
                        selectedSubcategory === subcategory.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleSubcategoryClick(subcategory.id)}
                    >
                      <span className="text-sm text-gray-700">{subcategory.name}</span>
                      <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Composition</h2>
              {compositions.map((composition) => (
                <label key={composition} className="flex items-center space-x-3 mb-3">
                  <input
                    type="checkbox"
                    checked={selectedComposition.includes(composition)}
                    onChange={() => handleCompositionChange(composition)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{composition}</span>
                </label>
              ))}
              <button 
                onClick={() => setSelectedComposition([])}
                className="text-sm text-gray-500 hover:text-gray-700 mt-4"
              >
                Clear all filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products