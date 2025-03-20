import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const images = {
  left: "https://images.pexels.com/photos/19688483/pexels-photo-19688483/free-photo-of-young-boy-posing-during-winter.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  right: "https://images.pexels.com/photos/10667859/pexels-photo-10667859.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  top: "https://images.pexels.com/photos/30683718/pexels-photo-30683718/free-photo-of-playful-child-in-blue-hoody-and-winter-hat.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  textBg: "https://img.freepik.com/free-photo/friends-spending-time-together_23-2149306141.jpg",
};

const backgrounds = [
  "https://images.pexels.com/photos/6261903/pexels-photo-6261903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  // "https://images.pexels.com/photos/5893858/pexels-photo-5893858.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/14416450/pexels-photo-14416450.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://img.freepik.com/free-photo/portrait-trendy-looking-cute-young-caucasian-male-with-wavy-voluminous-curly-hairstyle-fooling-around-pulling-gray-sweater-his-face-leaving-eyes-open-having-confident-facial-expression_343059-2565.jpg?t=st=1742237836~exp=1742241436~hmac=b9024bf8b5850f452dec6e48657239a43f3ab84d410f8cd9ede561d0963fbcf2&w=1380",
  "https://images.pexels.com/photos/6261904/pexels-photo-6261904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/12599035/pexels-photo-12599035.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://img.freepik.com/free-photo/fashion-winter-portrait-blonde-brunette-beautiful-best-friends-girls-hugs-having-fun-wearing-bright-stylish-cashmere-sweaters-scarfs-have-trendy-makeup-long-amazing-hairs_291049-569.jpg?t=st=1742238147~exp=1742241747~hmac=1a22a6e4096410cd4b1b1b74dbc9f25e07022c2f23e78a9fbfd1fdb6b3d64e03&w=826"


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