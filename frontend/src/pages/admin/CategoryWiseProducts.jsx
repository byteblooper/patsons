import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { fetchCategoryProducts, deleteProduct } from '../../data/adminApi';

function CategoryWiseProducts() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [categoryId]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchCategoryProducts(categoryId);
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    navigate(`/admin/category/${categoryId}/add-product`);
  };

  const handleEditProduct = (product) => {
    navigate(`/admin/category/${categoryId}/edit-product/${product.id}`);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        await loadProducts(); // Reload the products list
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Category Products</h1>
          <button
            onClick={handleAddProduct}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Product
          </button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No products found in this category
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden group relative"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={`http://127.0.0.1:8000${product.image}`}
                    alt={product.style_number}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {product.style_number}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">
                      Weight: {product.weight}
                    </span>
                  </div>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="Edit Product"
                  >
                    <PencilIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="Delete Product"
                  >
                    <TrashIcon className="h-5 w-5 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryWiseProducts;