import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInquiry } from '../context/InquiryContext';

function ProductCard({ product }) {
  const { addToInquiry, removeFromInquiry, isInInquiry } = useInquiry();
  const inInquiry = isInInquiry(product.id);

  const handleInquiryClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (inInquiry) {
      removeFromInquiry(product.id);
    } else {
      addToInquiry(product);
    }
  };

  return (
    <Link to={`/products/${product.id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-lg overflow-hidden shadow-lg group h-[400px] flex flex-col"
      >
        {/* Image Container with Fixed Dimensions */}
        <div className="relative w-full h-[320px] bg-gray-100 overflow-hidden">
          <div className="w-full h-full">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.style_number}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/placeholder.svg";
                e.target.onerror = null;
              }}
            />
          </div>
          
          {/* Style number overlay - visible on hover */}
          <div className="absolute inset-0 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-gradient-to-t from-black/70 to-transparent pb-5 pt-10">
              <div className="text-center">
                <h3 className="text-white text-lg font-medium px-2">
                  {product.style_number}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Add to Inquiry Button Section - Fixed Height */}
        <div className="bg-white p-4 flex-grow flex items-center">
          <button
            onClick={handleInquiryClick}
            className={`w-full px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              inInquiry 
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {inInquiry ? 'Remove from Inquiry' : 'Add to Inquiry'}
          </button>
        </div>
      </motion.div>
    </Link>
  );
}

export default ProductCard;