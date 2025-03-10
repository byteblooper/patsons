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
    <section className="py-12 sm:py-16">
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
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
            >
              <motion.img
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={currentImage}
                alt={product.description}
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.log("Image load error:", e);
                  e.target.src = "/placeholder.svg";
                }}
              />
              
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

            {/* Thumbnail Gallery */}
            {product.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setCurrentImageIndex(0)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 
                    ${currentImageIndex === 0 ? 'border-sky-500' : 'border-transparent'}`}
                >
                  <img
                    src={product.mainImage}
                    alt="Main"
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = "/placeholder.svg"}
                  />
                </motion.button>
                {product.images.map((img, index) => (
                  <motion.button
                    key={img.id}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setCurrentImageIndex(index + 1)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 
                      ${currentImageIndex === index + 1 ? 'border-sky-500' : 'border-transparent'}`}
                  >
                    <img
                      src={img.image}
                      alt={`Product view ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.src = "/placeholder.svg"}
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{product.style_number}</h1>
              {product.category && (
                <span className="inline-flex items-center rounded-full bg-sky-50 px-2 py-1 text-sm font-medium text-sky-700 ring-1 ring-inset ring-sky-700/10">
                  {product.category.name}
                </span>
              )}
            </div>
            
            <p className="text-gray-600">{product.description}</p>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Gauge</p>
                  <p className="font-medium">{product.gauge || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Weight</p>
                  <p className="font-medium">{product.weight || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Composition</h2>
              <div className="flex flex-wrap gap-2">
                {product.composition?.map((comp) => (
                  <span
                    key={comp.id}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                  >
                    {comp.material}
                  </span>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleInquiryClick}
              className={`w-full py-3 px-6 rounded-full font-medium transition-colors ${
                inInquiry
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {inInquiry ? 'Remove from Inquiry' : 'Add to Inquiry'}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails; 