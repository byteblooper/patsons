import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBagIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { categories } from '../data/products';
import { useInquiry } from '../context/InquiryContext';
import InquiryModal from './InquiryModal';

function Navbar() {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const navigate = useNavigate();
  const { inquiryItems } = useInquiry();

  const handleCategoryClick = (categoryId) => {
    navigate('/products', { state: { selectedCategory: categoryId } });
  };

  const handleSubcategoryClick = (categoryId, subcategoryId) => {
    navigate('/products', { 
      state: { 
        selectedCategory: categoryId,
        selectedSubcategory: subcategoryId 
      } 
    });
  };

  return (
    <nav className="bg-white shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Patson's
            </Link>
          </div>
          
          <div className="hidden sm:flex sm:space-x-8">
            <Link to="/" className="text-gray-900 hover:text-gray-500 px-3 py-2 text-sm font-medium">
              Home
            </Link>
            <div 
              className="relative group"
              onMouseEnter={() => setHoveredCategory('products')}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <button className="text-gray-900 hover:text-gray-500 px-3 py-2 text-sm font-medium inline-flex items-center">
                Products
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {hoveredCategory === 'products' && (
                <div className="absolute z-50 left-0 mt-2 w-[800px] bg-white rounded-lg shadow-lg grid grid-cols-4 gap-4 p-6">
                  {categories.map((category) => (
                    <div key={category.id} className="space-y-2">
                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        className="font-semibold text-gray-900 hover:text-blue-600 block"
                      >
                        {category.name}
                      </button>
                      <div className="space-y-1">
                        {category.subcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            onClick={() => handleSubcategoryClick(category.id, subcategory.id)}
                            className="block text-sm text-gray-600 hover:text-blue-600 w-full text-left pl-2"
                          >
                            {subcategory.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link to="/about" className="text-gray-900 hover:text-gray-500 px-3 py-2 text-sm font-medium">
              About
            </Link>
            <Link to="/contact" className="text-gray-900 hover:text-gray-500 px-3 py-2 text-sm font-medium">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-900 hover:text-gray-500">
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            <button 
              className="text-gray-900 hover:text-gray-500 relative"
              onClick={() => setIsInquiryModalOpen(true)}
            >
              <ShoppingBagIcon className="h-6 w-6" />
              {inquiryItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {inquiryItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <InquiryModal 
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
      />
    </nav>
  );
}

export default Navbar;