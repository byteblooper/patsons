import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="block group perspective">
      <div className="relative aspect-[3/4] bg-white transform-gpu transition-transform duration-500 ease-out group-hover:scale-[1.02] group-hover:shadow-xl">
        {/* Main Image Container with fixed aspect ratio */}
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.style_number}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            onError={(e) => {
              e.target.src = "/placeholder.svg";
              e.target.onerror = null;
            }}
          />
        </div>

        {/* Text Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
          <h3 className="text-3xl font-serif mb-4 text-white drop-shadow-lg">
            {product.style_number}
          </h3>
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/40 rounded-full px-4 py-2 hover:bg-white/30 transition-all duration-300">
            <span className="text-sm font-medium tracking-[0.2em] uppercase text-white drop-shadow">
              Discover Now
            </span>
            <svg 
              className="w-4 h-4 ml-2 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" 
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;