import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import CategoryNav from '../components/CategoryNav';

function Home() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate('/products', { state: { selectedCategory: categoryId } });
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <Hero />

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

      {/* New Category Navigation */}
      <CategoryNav />

     
    </div>
  );
}

export default Home;