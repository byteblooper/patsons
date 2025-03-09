import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInquiry } from '../context/InquiryContext';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToInquiry, removeFromInquiry, isInInquiry } = useInquiry();
  const inInquiry = isInInquiry(product.id);

  const handleInquiryClick = (e) => {
    e.stopPropagation();
    if (inInquiry) {
      removeFromInquiry(product.id);
    } else {
      addToInquiry(product);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer relative group"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="aspect-w-1 aspect-h-1 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
          src={product.image}
          alt={product.description}
          className="w-full h-full object-cover transform transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300" />
        <button
          onClick={handleInquiryClick}
          className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full font-medium transition-all duration-300 ${
            inInquiry 
              ? 'bg-red-500 text-white opacity-100'
              : 'bg-black text-white opacity-0 group-hover:opacity-100'
          }`}
        >
          {inInquiry ? 'Remove from inquiry' : 'Add to Inquiry'}
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.style_number}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        <div className="flex flex-wrap gap-2">
          {product.composition.map((comp) => (
            <span
              key={comp.id}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {comp.material}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard