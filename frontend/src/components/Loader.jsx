import { motion } from 'framer-motion';

function Loader() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [1, 0.5, 1],
            scale: [1, 0.98, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-4"
        >
          <img 
            src="/logo-light.svg" 
            alt="Studio Patsons"
            className="w-48 md:w-[15rem]"
          />
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="h-1 bg-gradient-to-r from-sky-600 to-indigo-600 mx-auto rounded-full"
          style={{ maxWidth: "300px" }}
        />
      </div>
    </div>
  );
}

export default Loader; 