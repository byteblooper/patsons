import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '../../data/products';

function AddProduct() {
  const { id: categoryId } = useParams();
  const navigate = useNavigate();
  const category = categories.find((c) => c.id === categoryId);

  const [product, setProduct] = useState({
    style_number: '',
    description: '',
    gauge: '',
    end: '',
    weight: '',
    composition: [],
    image: '',
  });

  const [newMaterial, setNewMaterial] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle product creation
    console.log('Creating product:', product);
    navigate('/admin');
  };

  const handleAddMaterial = () => {
    if (newMaterial.trim()) {
      setProduct({
        ...product,
        composition: [
          ...product.composition,
          {
            id: Date.now().toString(),
            material: newMaterial,
          },
        ],
      });
      setNewMaterial('');
    }
  };

  const handleRemoveMaterial = (materialId) => {
    setProduct({
      ...product,
      composition: product.composition.filter((m) => m.id !== materialId),
    });
  };

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Category not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Add Product to {category.name}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Style Number
              </label>
              <input
                type="text"
                value={product.style_number}
                onChange={(e) => setProduct({ ...product, style_number: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gauge
                </label>
                <input
                  type="text"
                  value={product.gauge}
                  onChange={(e) => setProduct({ ...product, gauge: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End
                </label>
                <input
                  type="text"
                  value={product.end}
                  onChange={(e) => setProduct({ ...product, end: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight
                </label>
                <input
                  type="text"
                  value={product.weight}
                  onChange={(e) => setProduct({ ...product, weight: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Composition
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  placeholder="Add material"
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddMaterial}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.composition.map((material) => (
                  <span
                    key={material.id}
                    className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-2"
                  >
                    {material.material}
                    <button
                      type="button"
                      onClick={() => handleRemoveMaterial(material.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={product.image}
                onChange={(e) => setProduct({ ...product, image: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;