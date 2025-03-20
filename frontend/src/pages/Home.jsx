import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import CategoryNav from '../components/CategoryNav';
import Loader from '../components/Loader';

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Start loading as soon as component mounts
    let isMounted = true;

    const loadContent = async () => {
      try {
        // Preload hero section images
        const imageUrls = [
          "https://img.freepik.com/free-photo/hand-painted-watercolor-background-with-sky-clouds-shape_24972-1095.jpg",
          "https://img.freepik.com/premium-vector/blue-mandala-background_1278957-1113.jpg",
          "https://img.freepik.com/free-photo/psychedelic-paper-shapes-with-copy-space_23-2149378246.jpg",
          "https://img.freepik.com/premium-photo/geometric-shapes-wavy-curve-wavy-seamless-blank-empty-design-banner-abstract_941600-236052.jpg"
        ];

        // Load all images concurrently
        await Promise.all([
          // Ensure minimum loading time for smooth transition
          new Promise(resolve => setTimeout(resolve, 1500)),
          // Load all images
          ...imageUrls.map(url => {
            return new Promise(resolve => {
              const img = new Image();
              img.onload = resolve;
              img.onerror = resolve; // Don't reject on error, just continue
              img.src = url;
            });
          })
        ]);

        // Only update state if component is still mounted
        if (isMounted) {
          setContentLoaded(true);
          // Delay hiding loader slightly for smooth transition
          setTimeout(() => {
            setIsLoading(false);
            // Add small delay before showing content animations
            setTimeout(() => {
              setShowContent(true);
            }, 300);
          }, 300);
        }
      } catch (error) {
        console.error('Error loading content:', error);
        if (isMounted) {
          setIsLoading(false);
          setShowContent(true);
        }
      }
    };

    loadContent();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50"
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Hero startAnimations={showContent} />

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
                <div key={i} className="flex gap-7">
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

          <CategoryNav />
        </motion.div>
      )}
    </div>
  );
}

export default Home;