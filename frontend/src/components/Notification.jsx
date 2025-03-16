import { motion, AnimatePresence } from 'framer-motion';

function Notification({ message, type = 'success', onClose }) {
  const colors = {
    success: 'bg-green-50 text-green-800 border-green-500',
    error: 'bg-red-50 text-red-800 border-red-500',
    info: 'bg-blue-50 text-blue-800 border-blue-500'
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 ${colors[type]}`}
        >
          <div className="flex items-center justify-between">
            <p className="mr-8">{message}</p>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Notification; 