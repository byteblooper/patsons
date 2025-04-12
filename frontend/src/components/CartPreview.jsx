import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInquiry } from '../context/InquiryContext';

function CartPreview({ isOpen, onClose }) {
  const { inquiryItems, removeFromInquiry, clearInquiry } = useInquiry();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const total = inquiryItems.reduce((acc, item) => acc + (parseFloat(item.price?.toString() || "0") || 0), 0);

  const handleClearInquiry = () => {
    clearInquiry();
    onClose();
  };

  const handleRemoveItem = (itemId) => {
    removeFromInquiry(itemId);
    if (inquiryItems.length === 1) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50"
    >
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Inquiry Busket ({inquiryItems.length})</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-auto">
        {inquiryItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Your Inquiry is empty</div>
        ) : (
          <div className="p-4 space-y-4">
            {inquiryItems.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="w-20 h-20 relative rounded overflow-hidden bg-gray-100">
                  <img 
                    src={item.image || "/placeholder.svg"} 
                    alt={item.style_number} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.style_number}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {inquiryItems.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Total Items:</span>
            <span className="font-semibold">{inquiryItems.length}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleClearInquiry}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear Inquiry
            </button>
            <button 
              onClick={() => {
                navigate('/inquiry');
                onClose();
              }} 
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
            >
              View Inquiry
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default CartPreview; 