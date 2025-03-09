import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/products';

function Home() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate('/products', { state: { selectedCategory: categoryId } });
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-screen bg-primary overflow-hidden">
        {/* Floating Images */}
        <motion.div
          initial={{ x: -100, y: -100 }}
          animate={{ x: [-100, 100, -100], y: [-100, 100, -100] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute left-20 top-40"
        >
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=250&h=350&fit=crop" 
               alt="Fashion" 
               className="w-64 h-80 object-cover rounded-lg transform -rotate-12 shadow-xl" />
        </motion.div>
        
        <motion.div
          initial={{ x: 100, y: -100 }}
          animate={{ x: [100, -100, 100], y: [-100, 100, -100] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute right-20 top-40"
        >
          <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=250&h=350&fit=crop" 
               alt="Fashion" 
               className="w-64 h-80 object-cover rounded-lg transform rotate-12 shadow-xl" />
        </motion.div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-8xl font-bold mb-8 clip-text moving-bg"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop')`,
              }}>
            Studio Patson
          </h1>
          <div className="text-2xl text-center text-gray-300 space-y-2">
            <p>FASHION FASHION REDEFINED FASHION REDEFINED</p>
          </div>
          <button 
            onClick={() => navigate('/products')}
            className="mt-12 px-8 py-3 bg-white text-primary rounded-full text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Explore Collection
          </button>
        </div>
      </div>

      {/* Marquee Section */}
      <div className="bg-black text-white py-4 overflow-hidden whitespace-nowrap">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="inline-flex gap-8"
        >
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-8">
              <span className="text-lg">Premium Quality Garments</span>
              <span>•</span>
              <span className="text-lg">Trusted by Leading Brands</span>
              <span>•</span>
              <span className="text-lg">Global Sourcing Excellence</span>
              <span>•</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Category Sections */}
      <div className="bg-white">
        {categories.map((category, index) => (
          <div 
            key={category.id}
            className={`flex items-center ${index % 2 === 0 ? '' : 'flex-row-reverse'} min-h-[600px] relative overflow-hidden`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className={`w-1/2 p-20 ${index % 2 === 0 ? 'pl-32' : 'pr-32'}`}>
              <h2 className={`text-[150px] font-bold ${index % 2 === 0 ? 'text-[#0088cc]' : 'text-[#1a1a1a]'}`}>
                {category.name.split(' ')[0]}
              </h2>
            </div>
            <div className="w-1/2 h-full">
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;