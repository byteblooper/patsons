import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInquiry } from '../context/InquiryContext';
import { products } from '../data/products';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToInquiry, removeFromInquiry, isInInquiry } = useInquiry();
  
  const product = products.find(p => p.id === id);
  const inInquiry = isInInquiry(id);
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  const handleInquiryClick = () => {
    if (inInquiry) {
      removeFromInquiry(product.id);
    } else {
      addToInquiry(product);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square overflow-hidden rounded-lg"
          >
            <motion.img
              whileHover={{ scale: 1.1 }}
              src={product.image}
              alt={product.description}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h1 className="text-3xl font-bold">{product.style_number}</h1>
            <p className="text-gray-600">{product.description}</p>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Gauge</p>
                  <p className="font-medium">{product.gauge}</p>
                </div>
                <div>
                  <p className="text-gray-600">Weight</p>
                  <p className="font-medium">{product.weight}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Composition</h2>
              <div className="flex flex-wrap gap-2">
                {product.composition.map((comp) => (
                  <span
                    key={comp.id}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                  >
                    {comp.material}
                  </span>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleInquiryClick}
              className={`w-full py-3 px-6 rounded-full font-medium transition-colors ${
                inInquiry
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {inInquiry ? 'Remove from Inquiry' : 'Add to Inquiry'}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail