import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useInquiry } from '../context/InquiryContext';

function InquiryModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { inquiryItems, removeFromInquiry } = useInquiry();

  const handleGetInquiry = () => {
    navigate('/inquiry');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-4 w-96 bg-white rounded-lg shadow-xl z-50"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Inquiry Cart ({inquiryItems.length})
              </h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4">
              {inquiryItems.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Your inquiry cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {inquiryItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.description}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.style_number}</h3>
                      </div>
                      <button
                        onClick={() => removeFromInquiry(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <button
                onClick={handleGetInquiry}
                className="w-full bg-blue-600 text-white py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                Get Inquiry
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default InquiryModal;