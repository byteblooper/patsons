import { useEffect, useState } from "react";
import {  AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const images = {
  left: "https://images.pexels.com/photos/19688483/pexels-photo-19688483/free-photo-of-young-boy-posing-during-winter.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  right: "https://images.pexels.com/photos/2566927/pexels-photo-2566927.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  top: "https://images.pexels.com/photos/30683718/pexels-photo-30683718/free-photo-of-playful-child-in-blue-hoody-and-winter-hat.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  textBg: "https://img.freepik.com/free-photo/friends-spending-time-together_23-2149306141.jpg",
};


// const backgrounds = [
 

// ];


const backgrounds = [
  '/woman-sweater-in-hand.jpeg',
  '/woman-in-man.jpeg',
  '/rsz_chair.jpg',
  '/girl-on-sweater.jpg',
  '/boy-on-sweater.jpg',
  '/kid1.jpeg'

];



function Hero({ startAnimations }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [bgImage, setBgImage] = useState(backgrounds[0]);
  const [showContent, setShowContent] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInitialSequence, setIsInitialSequence] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);

    const initialSequence = async () => {
      // Preload all images first
      await Promise.all(
        backgrounds.map(src => {
          const img = new Image();
          img.src = src;
          return new Promise(resolve => {
            img.onload = resolve;
          });
        })
      );

      // First iteration - show all images immediately one after another
      for (let i = 0; i < backgrounds.length; i++) {
        setBgImage(backgrounds[i]);
        setCurrentImageIndex(i);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      setIsInitialSequence(false);
      setShowContent(true);
      startNormalSequence();
    };

    // Normal sequence
    const startNormalSequence = () => {
      let index = 0;
      const interval = setInterval(() => {
        index = (index + 1) % backgrounds.length;
        setBgImage(backgrounds[index]);
        setCurrentImageIndex(index);
      }, 3000);

      return () => clearInterval(interval);
    };

    if (startAnimations) {
      initialSequence();
    }

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [startAnimations]);

  if (!isMounted) return null;

  const titleAnimation = startAnimations ? {
    opacity: 1,
    y: 0
  } : {
    opacity: 0,
    y: 50
  };

  const leftImageAnimation = startAnimations ? {
    x: "0%",
    rotate: 35,
    opacity: 1
  } : {
    x: "-100%",
    rotate: 0,
    opacity: 0
  };

  const rightImageAnimation = startAnimations ? {
    x: "0%",
    rotate: -35,
    opacity: 1
  } : {
    x: "100%",
    rotate: 0,
    opacity: 0
  };

  const smallImageAnimation = startAnimations ? {
    x: "0%",
    rotate: -25,
    opacity: 1
  } : {
    x: "-100%",
    rotate: -360,
    opacity: 0
  };

  return (
    <div className="relative  h-screen w-full overflow-hidden bg-black">
      {/* Background Image */}
      <AnimatePresence initial={false}>
        <motion.div
          key={bgImage}
          className="absolute inset-0"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.5 }}
          transition={{ 
            duration: isInitialSequence ? 0.2 : 0.8,
            ease: "easeInOut"
          }}
        >
          <img
            src={bgImage}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      {showContent && (
        <>
          <div className="absolute max-sm:bottom-32 inset-0 flex items-center justify-center overflow-hidden">
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 50 }}
              animate={titleAnimation}
              transition={{ duration: 1, delay: startAnimations ? 0.5 : 0 }}
              style={{
                backgroundImage: `url(${images.textBg})`,
                backgroundSize: "90% 80%",
                backgroundPosition: "0% center",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <motion.div
                className="flex flex-col  items-center"
                animate={{
                  backgroundPosition: ["0% center", "100% center"],
                }}
                transition={{
                  backgroundPosition: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 20,
                    ease: "linear",
                  },
                }}
                style={{
                  backgroundImage: `url(${images.textBg})`,
                  backgroundSize: "90% 80%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                <span className="text-[clamp(4rem,18vw,10rem)] font-bold leading-none tracking-tighter">
                  Studio
                </span>
                <span className="text-[clamp(5rem,22vw,14rem)] font-bold leading-none tracking-tighter md:-mt-12">
                  Patsons
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* Desktop-only Images */}
          <div className="absolute inset-0 hidden md:block">
            <motion.div
              className="absolute left-[7%] top-[10%] -translate-y-1/2 w-[min(200px,25vw)] h-[min(500px,37vh)]"
              initial={{ x: "-100%", rotate: 0, opacity: 0 }}
              animate={leftImageAnimation}
              transition={{ duration: 1.2, ease: "easeOut", delay: startAnimations ? 0.7 : 0 }}
            >
              <div className="relative w-full h-full">
                <img
                  src={images.left}
                  alt="Fashion model"
                  className="w-full h-full object-cover border-4 border-white rounded-lg shadow-2xl"
                />
              </div>
            </motion.div>

            <motion.div
              className="absolute left-[1%] top-[50%] w-[min(100px,15vw)] h-[min(200px,21vh)]"
              initial={{ x: "-100%", rotate: -360, opacity: 0 }}
              animate={smallImageAnimation}
              transition={{ duration: 1.5, ease: "easeOut", delay: startAnimations ? 0.9 : 0 }}
            >
              <div className="relative w-full h-full">
                <img
                  src={images.top}
                  alt="Fashion model"
                  className="w-full h-full object-cover border-4 border-white rounded-lg shadow-2xl"
                />
              </div>
            </motion.div>

            <motion.div
              className="absolute right-[7%] top-[30%] -translate-y-1/2 w-[min(200px,25vw)] h-[min(500px,37vh)]"
              initial={{ x: "100%", rotate: 0, opacity: 0 }}
              animate={rightImageAnimation}
              transition={{ duration: 1.2, ease: "easeOut", delay: startAnimations ? 0.7 : 0 }}
            >
              <div className="relative w-full h-full">
                <img
                  src={images.right}
                  alt="Fashion model"
                  className="w-full h-full object-cover border-4 border-white rounded-lg shadow-2xl"
                />
              </div>
            </motion.div>
          </div>

          {/* Mobile and Desktop CTA */}
          <motion.div
            className="absolute top-[60%] md:top-[72%] -translate-x-1/2 text-center w-full px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={startAnimations ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: startAnimations ? 1.2 : 0 }}
          >
            <p className="text-lg md:text-2xl font-light text-gray-300">
              FASHION FASHION REDEFINED FASHION REDEFINED
            </p>
            <button
              onClick={() => navigate('/products')}
              className="group px-6 md:px-10 py-2 md:py-3 mt-4 text-base md:text-lg
                bg-white/30 backdrop-blur-md
                border border-white/40
                text-white font-medium tracking-wider
                rounded-full shadow-[0_8px_32px_rgba(255,255,255,0.3)]
                hover:bg-white/40 hover:border-white/50
                hover:shadow-[0_8px_40px_rgba(255,255,255,0.45)]
                hover:text-black
                focus:ring-4 focus:ring-white/30 focus:outline-none
                transition-all duration-500 ease-out
                relative overflow-hidden
                before:absolute before:inset-0
                before:bg-gradient-to-r before:from-white/60 before:to-transparent
                before:-skew-x-12 before:translate-x-[-200%]
                hover:before:translate-x-[200%] before:transition-transform before:duration-1000
                after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.4),transparent_70%)]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Explore Collection
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </motion.div>

          {/* Image indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {backgrounds.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentImageIndex === index ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Hero; 