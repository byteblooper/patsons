import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInquiry } from "../context/InquiryContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BaseUrl from "../data/ApiUrl";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToInquiry, removeFromInquiry, isInInquiry } = useInquiry();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const inInquiry = product ? isInInquiry(product.id) : false;

  // Function to ensure image URL is absolute
  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder.svg";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${BaseUrl}${imageUrl}`;
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${BaseUrl}/api/products/${id}/`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.product) {
          const processedProduct = {
            ...data.product,
            mainImage: getFullImageUrl(data.product.image),
            images: (data.product.images || []).map(img => ({
              ...img,
              image: getFullImageUrl(img.image)
            }))
          };
          setProduct(processedProduct);
        } else {
          throw new Error(data.message || 'Failed to load product');
        }
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600">{error || 'Product not found'}</p>
      </div>
    );
  }

  const handleInquiryClick = () => {
    if (inInquiry) {
      removeFromInquiry(product.id);
    } else {
      // Add the mainImage as image property before adding to inquiry
      const productWithImage = {
        ...product,
        image: product.mainImage
      };
      addToInquiry(productWithImage);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length : prev - 1
    );
  };

  // Get current image URL based on index
  const getCurrentImageUrl = () => {
    if (currentImageIndex === 0) {
      return product.mainImage;
    }
    const additionalImage = product.images[currentImageIndex - 1];
    return additionalImage ? additionalImage.image : product.mainImage;
  };

  const currentImage = getCurrentImageUrl();

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto">
      <div className="container mx-auto px-4">
        <nav className="flex mb-8">
          <ol role="list" className="flex items-center">
            <li className="text-left">
              <div className="-m-1">
                <Link
                  to="/"
                  className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                >
                  Home
                </Link>
              </div>
            </li>
            <li className="text-left">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <div className="-m-1">
                  <Link
                    to="/products"
                    className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                  >
                    Products
                  </Link>
                </div>
              </div>
            </li>
            <li className="text-left">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <div className="-m-1">
                  <Link
                    to={`/products?category=${product.category?.id || ''}`}
                    className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                    aria-current="page"
                  >
                    {product.category?.name || 'Product'}
                  </Link>
                </div>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side - Image Gallery */}
          <div className="flex gap-10">
            {/* Thumbnails on the left */}
            <div className="flex flex-col gap-2">
              {[product.mainImage, ...(product.images || []).map(img => img.image)].map((img, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0
                    ${currentImageIndex === index ? 'border-sky-500' : 'border-gray-200'}`}
                >
                  <img
                    src={img}
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = "/placeholder.svg"}
                  />
                </motion.button>
              ))}
            </div>

            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative flex-grow aspect-[3/4]"
            >
              <div className="w-full h-full rounded-lg overflow-hidden bg-white">
                <motion.div
                  className="w-full h-full flex items-center justify-center overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.img
                    key={currentImage}
                    src={currentImage}
                    alt={product.description}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                </motion.div>

                {/* Navigation Arrows */}
                {product.images.length > 0 && (
                  <>
                    <button
                      onClick={previousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg backdrop-blur-sm"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg backdrop-blur-sm"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Side - Product Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Product Title */}
            <h1 className="text-3xl font-bold text-gray-900">
              {product.style_number}
            </h1>

            {/* Specifications */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Specifications</h2>
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-gray-600">Style Number</p>
                  <p className="font-medium">{product.style_number}</p>
                </div>
                <div>
                  <p className="text-gray-600">Gauge</p>
                  <p className="font-medium">{product.gauge}</p>
                </div>
                <div>
                  <p className="text-gray-600">End</p>
                  <p className="font-medium">{product.end}</p>
                </div>
                <div>
                  <p className="text-gray-600">Weight</p>
                  <p className="font-medium">{product.weight}</p>
                </div>
              </div>
            </div>

            {/* Composition */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Composition</h2>
              <div className="flex flex-wrap gap-2">
                {product.composition?.map((comp) => (
                  <span
                    key={comp.id}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {comp.material}
                  </span>
                ))}
              </div>
            </div>

            {/* Add to Basket Button */}
            <button
              onClick={handleInquiryClick}
              className="w-full bg-gray-900 text-white py-3 px-4 rounded flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {inInquiry ? 'Remove from Basket' : 'Add to Basket'}
            </button>
          </motion.div>
        </div>

        {/* Description Tab */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <button className="text-lg font-medium text-gray-900 pb-4 border-b-2 border-gray-900">
              Description
            </button>
          </div>
          <div className="py-6">
            <h3 className="text-xl font-bold mb-4">Product Details</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails; 