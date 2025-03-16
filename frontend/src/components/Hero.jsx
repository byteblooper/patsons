import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const images = {
  left: "https://img.freepik.com/premium-photo/young-beautiful-girl-with-long-curly-hair-brown-leather-jacket-posing-pastel-orange_97875-680.jpg?uid=R114821896&ga=GA1.1.1103696323.1736837892&semt=ais_hybrid",
  right: "https://img.freepik.com/free-photo/trendy-model-posing-contently-with-buying_23-2147689049.jpg?uid=R114821896&ga=GA1.1.1103696323.1736837892&semt=ais_hybrid",
  top: "https://img.freepik.com/free-photo/stylish-woman-summer-outfit-isolated-posing-fashion-trend-isolated_285396-480.jpg?uid=R114821896&ga=GA1.1.1103696323.1736837892&semt=ais_hybrid",
  textBg: "https://img.freepik.com/free-photo/happy-teenager-with-fringe-pointing_1149-964.jpg?uid=R114821896&ga=GA1.1.1103696323.1736837892&semt=ais_hybrid",
};

const backgrounds = [
  "https://img.freepik.com/free-photo/hand-painted-watercolor-background-with-sky-clouds-shape_24972-1095.jpg?uid=R114821896&ga=GA1.1.1103696323.1736837892&semt=ais_hybrid",
  "https://img.freepik.com/premium-vector/blue-mandala-background_1278957-1113.jpg?uid=R114821896&ga=GA1.1.1103696323.1736837892&semt=ais_hybrid",
  "https://img.freepik.com/free-photo/psychedelic-paper-shapes-with-copy-space_23-2149378246.jpg?uid=R114821896&ga=GA1.1.1103696323.1736837892&semt=ais_hybrid",
  "https://img.freepik.com/premium-photo/geometric-shapes-wavy-curve-wavy-seamless-blank-empty-design-banner-abstract_941600-236052.jpg?uid=R114821896&ga=GA1.1.1103696323.1736837892&semt=ais_hybrid",
];

function Hero({ startAnimations }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [bgImage, setBgImage] = useState(backgrounds[0]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
    let interval;
    
    if (startAnimations) {
      interval = setInterval(() => {
        setBgImage(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
      }, 5000);
    }

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (interval) clearInterval(interval);
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
    <div
      className={`relative ${isDesktop ? 'h-screen' : 'min-h-[90vh]'} w-full overflow-hidden flex flex-col items-center justify-center bg-cover bg-center transition-all duration-1000`}
      style={{ backgroundImage: `url(${bgImage})`, opacity: startAnimations ? 1 : 0 }}
    >
      {isDesktop ? (
        <>
          <div
            className="absolute inset-0 opacity-20 transition-opacity duration-1000"
            style={{
              backgroundImage: 'url("/palm-shadow.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: startAnimations ? 0.2 : 0
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
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
                className="flex flex-col items-center"
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
                <span className="text-[clamp(6rem,10vw,10rem)] font-bold leading-none tracking-tighter">
                  Studio
                </span>
                <span className="text-[clamp(5rem,14vw,14rem)] font-bold leading-none tracking-tighter -mt-12">
                  Patsons
                </span>
              </motion.div>
            </motion.div>
          </div>

          <div className="absolute inset-0">
            <motion.div
              className="absolute left-[7%] top-[30%] -translate-y-1/2 w-[min(200px,25vw)] h-[min(500px,37vh)]"
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

          <motion.div
            className="absolute top-[72%] -translate-x-1/2 text-center w-full px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={startAnimations ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: startAnimations ? 1.2 : 0 }}
          >
            <p className="text-lg md:text-2xl font-light text-gray-600">
              FASHION FASHION REDEFINED FASHION REDEFINED
            </p>
            <button
              onClick={() => navigate('/products')}
              className="group px-6 md:px-10 py-2 md:py-3 mt-4 text-base md:text-lg
                bg-white/30 backdrop-blur-md
                border border-black/40
                text-black/80 font-medium tracking-wider
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
        </>
      ) : (
        <motion.div
          className="w-full px-6 pb-16 pt-8 flex flex-col items-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={startAnimations ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          {/* Mobile Title */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={startAnimations ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div
              className="flex flex-col items-center"
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
                backgroundSize: "cover",
                backgroundPosition: "center",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <span className="text-[clamp(4rem,18vw,6rem)] font-bold leading-none tracking-tighter">
                Studio
              </span>
              <span className="text-[clamp(5rem,22vw,8rem)] font-bold leading-none tracking-tighter -mt-6">
                Patsons
              </span>
            </motion.div>
          </motion.div>

          {/* Mobile Images */}
          <div className="relative hidden md:block w-full h-[50vh] mb-8">
            <motion.div
              className="absolute left-[5%] top-[20%] w-[45vw] h-[35vh]"
              initial={{ x: "-100%", rotate: 0 }}
              animate={startAnimations ? { x: "0%", rotate: 15 } : { x: "-100%", rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <img
                src={images.left}
                alt="Fashion model"
                className="w-full h-full object-cover border-2 border-white rounded-lg shadow-xl"
              />
            </motion.div>

            <motion.div
              className="absolute right-[5%] top-[20%] w-[45vw] h-[35vh]"
              initial={{ x: "100%", rotate: 0 }}
              animate={startAnimations ? { x: "0%", rotate: -15 } : { x: "100%", rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <img
                src={images.right}
                alt="Fashion model"
                className="w-full h-full object-cover border-2 border-white rounded-lg shadow-xl"
              />
            </motion.div>
          </div>

          {/* Mobile CTA */}
          <div className="flex flex-col gap-4 items-center">
            <p className="text-base font-light text-gray-600 text-center">
              FASHION REDEFINED
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-black text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-gray-900 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center group"
            >
              Explore Collection
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Hero; 