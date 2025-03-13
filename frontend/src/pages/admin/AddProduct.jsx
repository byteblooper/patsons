import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, fetchSubcategories, fetchCompositions, getCookie } from '../../data/adminApi';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

function AddProduct() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [compositions, setCompositions] = useState([]);
  const [productData, setProductData] = useState({
    style_number: '',
    gauge: '',
    end: '',
    weight: '',
    description: '',
    category: categoryId || '',
    sub_category: '',
    composition: [],
    image: null,
    images: []
  });

  // Image preview state
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);

  useEffect(() => {
    if (categoryId) {
      setProductData(prev => ({
        ...prev,
        category: categoryId
      }));
    }
  }, [categoryId]);

  useEffect(() => {
    console.log('Current categoryId:', categoryId);
    console.log('Current productData:', productData);
  }, [categoryId, productData]);

  useEffect(() => {
    const loadData = async () => {
      if (!categoryId) return;
      
      try {
        setLoading(true);
        const [subcategoriesData, compositionsData] = await Promise.all([
          fetchSubcategories(categoryId),
          fetchCompositions()
        ]);
        
        console.log('Subcategories:', subcategoriesData);
        setSubcategories(subcategoriesData);
        setCompositions(compositionsData?.compositions || []);
      } catch (err) {
        setError('Failed to load form data');
        console.error('Load data error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [categoryId]);

  if (!categoryId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-500">Invalid category ID</p>
          <button
            onClick={() => navigate('/admin')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productData.sub_category || productData.composition.length === 0) {
      setError('Please select both subcategory and composition');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();

      // Keep existing basic fields
      formData.append('style_number', productData.style_number);
      formData.append('gauge', productData.gauge);
      formData.append('end', productData.end);
      formData.append('weight', productData.weight);
      formData.append('description', productData.description);
      formData.append('category', productData.category);
      formData.append('sub_category', productData.sub_category);

      // Keep existing composition handling
      if (productData.composition.length > 0) {
        productData.composition.forEach(comp => {
          formData.append('composition', comp);
        });
      }

      // Handle main image
      if (productData.image) {
        formData.append('image', productData.image);
      }

      // Modified: Handle multiple images in the required nested format
      if (productData.images && productData.images.length > 0) {
        // First, append each image file directly
        productData.images.forEach((file, index) => {
          formData.append(`images[${index}]image`, file);
        });
      }

      // Debug log
      console.log('Sending form data:');
      for (let pair of formData.entries()) {
        console.log(pair[0], ':', pair[1]);
      }

      const response = await fetch('http://127.0.0.1:8000/api/admin/products/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': getCookie('csrftoken'),
        },
        credentials: 'include',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      console.log('Product created successfully:', data);
      navigate(`/admin/category/${categoryId}/products`);
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  // Update the composition select handler
  const handleCompositionChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
    console.log('Selected composition values:', selectedValues); // Debug log
    setProductData(prev => ({
      ...prev,
      composition: selectedValues
    }));
  };

  // Updated image handlers with previews
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductData(prev => ({
        ...prev,
        image: file
      }));
      // Create preview URL
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setProductData(prev => ({
        ...prev,
        images: files
      }));
      // Create preview URLs
      const previewUrls = files.map(file => URL.createObjectURL(file));
      setAdditionalImagePreviews(previewUrls);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(`/admin/category/${categoryId}/products`)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Products
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Add New Product</h1>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Style Number *
              </label>
              <input
                type="text"
                value={productData.style_number}
                onChange={(e) => setProductData({...productData, style_number: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory *
              </label>
              <select
                value={productData.sub_category}
                onChange={(e) => setProductData({...productData, sub_category: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Subcategory</option>
                {subcategories.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
              {subcategories.length === 0 && !loading && (
                <p className="text-sm text-gray-500 mt-1">
                  No subcategories available for this category
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Composition *
              </label>
              <select
                multiple
                value={productData.composition}
                onChange={handleCompositionChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                size="3"
                required
              >
                {compositions.map(comp => (
                  <option key={comp.id} value={comp.id}>
                    {comp.material}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Hold Ctrl/Cmd to select multiple compositions
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gauge *
              </label>
              <input
                type="text"
                value={productData.gauge}
                onChange={(e) => setProductData({...productData, gauge: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End *
              </label>
              <input
                type="text"
                value={productData.end}
                onChange={(e) => setProductData({...productData, end: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight *
              </label>
              <input
                type="text"
                value={productData.weight}
                onChange={(e) => setProductData({...productData, weight: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={productData.description}
                onChange={(e) => setProductData({...productData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                required
              />
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Image
                </label>
                <input
                  type="file"
                  onChange={handleMainImageChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  accept="image/*"
                />
                {mainImagePreview && (
                  <div className="mt-2">
                    <img 
                      src={mainImagePreview} 
                      alt="Main preview" 
                      className="h-32 w-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Images
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleAdditionalImagesChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  accept="image/*"
                />
                {additionalImagePreviews.length > 0 && (
                  <div className="mt-2 flex gap-2 overflow-x-auto">
                    {additionalImagePreviews.map((preview, index) => (
                      <img 
                        key={index}
                        src={preview} 
                        alt={`Preview ${index + 1}`}
                        className="h-32 w-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate(`/admin/category/${categoryId}/products`)}
              className="mr-4 px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;