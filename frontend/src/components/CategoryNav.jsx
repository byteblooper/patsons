import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllCategories } from '../data/products';
import BaseUrl from '../data/ApiUrl';

function CategoryNav() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchAllCategories();
        console.log('Raw categories data:', data);
        
        // Handle both array and object response formats
        const categoriesData = Array.isArray(data) ? data : data.categories || [];
        console.log('Processed categories data:', categoriesData);
        
        if (categoriesData.length === 0) {
          setError('No categories found');
        } else {
          // Filter only main categories (those without parent)
          const mainCategories = categoriesData.filter(cat => !cat.parent);
          setCategories(mainCategories);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="w-full overflow-hidden py-8 md:py-16">
        <div className="container mx-auto px-2">
          <div className="text-center">
            <p className="text-gray-500">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full overflow-hidden py-8 md:py-16">
        <div className="container mx-auto px-2">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden py-8 md:py-16">
      <div className="container mx-auto px-2">
        <div className="flex flex-col gap-5">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              to={`/products?main=${cat.id}`}
              className="block group"
            >
              <div
                className={`
                  flex flex-row items-center justify-center
                  ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}
                  rounded-lg hover:shadow-lg transition-shadow
                  relative overflow-hidden
                `}
              >
                <h2
                  className={`text-5xl max-sm:relative ${
                    index % 2 === 0 ? "-right-11" : "right-[3.3rem]"
                  } md:text-[8rem] font-black text-gray-800 group-hover:text-sky-600 mb-4 md:mb-0 transition-colors`}
                >
                  {cat.name.toUpperCase()}
                </h2>
                <img
                  src={cat.image ? `${BaseUrl}${cat.image}` : "/placeholder.svg"}
                  alt={cat.name}
                  className={`w-full md:w-1/2 h-52 md:h-auto object-cover rounded-lg ${
                    index % 2 === 0 ? "p-6" : "p-6"
                  }`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.svg";
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryNav; 