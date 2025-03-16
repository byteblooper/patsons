import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="block group">
      <div className="relative h-[600px] bg-white overflow-hidden">
        {/* Full Image Container */}
        <div className="w-full h-full">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.style_number}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder.svg";
              e.target.onerror = null;
            }}
          />
        </div>

        {/* Text Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-white/50 hover:bg-white/90 transition-all duration-300">
          <div className="space-y-4 ">
            <h3 className="text-3xl font-serif">{product.style_number}</h3>
            <div className="flex items-center space-x-2 group cursor-pointer">
              <span className="text-sm font-medium tracking-[0.2em]">DISCOVER NOW</span>
              
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;