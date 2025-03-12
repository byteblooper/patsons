import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInquiry } from "../context/InquiryContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { products as localProducts } from "../data/products";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToInquiry, removeFromInquiry, isInInquiry } = useInquiry();
  const inInquiry = product ? isInInquiry(product.id) : false;

  // Function to ensure image URL is absolute
  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder.svg";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `https://patsons.pythonanywhere.com${imageUrl}`;
  };

  useEffect(() => {
    // API endpoint for future reference:
    // const fetchProduct = async () => {
    //   try {
    //     const response = await fetch(`https://patsons.pythonanywhere.com/api/products/${id}/`);
    //     if (!response.ok) {
    //       throw new Error(`Failed to fetch product data: ${response.statusText}`);
    //     }
    //     const data = await response.json();
    //     if (data.status === "success") {
    //       setProduct(data.product);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching product:", error);
    //   }
    // };

    // Using local data
    const foundProduct = localProducts.find(p => p.id === id);
    if (foundProduct) {
      const processedProduct = {
        ...foundProduct,
        mainImage: getFullImageUrl(foundProduct.images?.[0]?.image),
        images: (foundProduct.images || []).map(img => ({
          ...img,
          image: getFullImageUrl(img.image)
        }))
      };
      setProduct(processedProduct);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  const handleInquiryClick = () => {
    if (inInquiry) {
      removeFromInquiry(product.id);
    } else {
      addToInquiry(product);
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
  console.log("Current Image URL:", currentImage);

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
              className="relative flex-grow"
            >
              <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
                <motion.img
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={currentImage}
                  alt={product.description}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg";
                  }}
                />
              </div>
              
              {/* Navigation Arrows */}
              {product.images.length > 0 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
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
              Mens Wool Sweater
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
                  <p className="text-gray-600">Factory Code</p>
                  <p className="font-medium">{product.style_number}</p>
                </div>
                <div>
                  <p className="text-gray-600">Weight</p>
                  <p className="font-medium">{product.weight || 'L'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Sample Type</p>
                  <p className="font-medium">Production</p>
                </div>
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

            {/* Shipping and Payment Info */}
           
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