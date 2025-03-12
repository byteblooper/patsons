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

function Hero() {
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [bgImage, setBgImage] = useState(backgrounds[0]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setBgImage(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
    }, 5000);

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className={`relative ${isDesktop ? 'h-screen' : 'min-h-[90vh]'} w-full overflow-hidden flex flex-col items-center justify-center bg-cover bg-center`}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {isDesktop ? (
        <>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'url("/palm-shadow.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <motion.h1
              className="text-[clamp(4rem,12vw,8rem)] font-bold leading-none tracking-tighter text-center px-4"
              style={{
                backgroundImage: `url(${images.textBg})`,
                backgroundSize: "90% 80%",
                backgroundPosition: "0% center",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              }}
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
            >
              Studio Patsons
            </motion.h1>
          </div>

          <div className="absolute inset-0">
            <motion.div
              className="absolute left-[7%] top-[30%] -translate-y-1/2 w-[min(200px,25vw)] h-[min(500px,37vh)]"
              initial={{ x: "-100%", rotate: 0 }}
              animate={{ x: "0%", rotate: 35 }}
              transition={{ duration: 1, ease: "easeOut" }}
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
              initial={{ x: "-100%", rotate: -360 }}
              animate={{ x: "0%", rotate: -25 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
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
              className="absolute  right-[7%] top-[30%] -translate-y-1/2 w-[min(200px,25vw)] h-[min(500px,37vh)]"
              initial={{ x: "100%", rotate: 0 }}
              animate={{ x: "0%", rotate: -35 }}
              transition={{ duration: 1, ease: "easeOut" }}
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
            className="absolute top-[62%] -translate-x-1/2 text-center w-full px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <p className="text-lg md:text-2xl font-light text-gray-600">
              FASHION FASHION REDEFINED FASHION REDEFINED
            </p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 md:px-10 py-2 md:py-3 bg-black text-white mt-4 text-base md:text-lg hover:bg-gray-800 transition-colors"
            >
              Explore Collection
            </button>
          </motion.div>
        </>
      ) : (
        <motion.div
          className="w-full px-6 pb-16 pt-8 flex flex-col items-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Mobile Title */}
          <motion.h1
            className="text-[clamp(3rem,15vw,4rem)] font-bold leading-none tracking-tighter text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              backgroundImage: `url(${images.textBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Studio Patsons
          </motion.h1>

          {/* Mobile Images */}
          <div className="relative hidden md:block w-full h-[50vh] mb-8">
            <motion.div
              className="absolute left-[5%] top-[20%] w-[45vw] h-[35vh]"
              initial={{ x: "-100%", rotate: 0 }}
              animate={{ x: "0%", rotate: 15 }}
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
              animate={{ x: "0%", rotate: -15 }}
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