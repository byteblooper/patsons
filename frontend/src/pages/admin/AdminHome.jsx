import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PencilIcon, 
  PlusIcon, 
  TrashIcon,
  XMarkIcon,
  ListBulletIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  fetchCompositions,
  createComposition,
  updateComposition,
  deleteComposition,
  fetchCategoryProducts,
  updateProduct,
  deleteProduct
} from '../../data/adminApi';

function AdminHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('categories');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddComposition, setShowAddComposition] = useState(false);
  const [showEditComposition, setShowEditComposition] = useState(false);
  const [showDeleteComposition, setShowDeleteComposition] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedComposition, setSelectedComposition] = useState(null);
  const [newSubcategory, setNewSubcategory] = useState('');
  const [newCategory, setNewCategory] = useState({
    name: '',
    image: '',
    subcategories: []
  });
  const [newComposition, setNewComposition] = useState({
    material: ''
  });
  const [categories, setCategories] = useState([]);
  const [compositions, setCompositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showDeleteProduct, setShowDeleteProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (activeTab === 'categories') {
      loadCategories();
    } else {
      loadCompositions();
    }
  }, [activeTab]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const loadCompositions = async () => {
    try {
      setLoading(true);
      const data = await fetchCompositions();
      setCompositions(data.compositions || []);
    } catch (err) {
      setError('Failed to load compositions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = (categoryId) => {
    navigate(`/admin/category/${categoryId}/add-product`);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowEditCategory(true);
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCategory(selectedCategory.id);
      await loadCategories();
      setShowDeleteConfirm(false);
      setSelectedCategory(null);
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  const handleAddSubcategory = () => {
    if (newSubcategory.trim()) {
      const updatedCategory = {
        ...selectedCategory,
        subcategories: [
          ...selectedCategory.subcategories,
          {
            name: newSubcategory
          }
        ]
      };
      setSelectedCategory(updatedCategory);
      setNewSubcategory('');
    }
  };

  const handleSaveCategory = async () => {
    try {
      if (!selectedCategory.name.trim()) {
        setErrorMessage('Category name is required');
        return;
      }

      // Prepare the update data in the format the API expects
      const updateData = {
        id: selectedCategory.id,
        name: selectedCategory.name,
        subcategories: selectedCategory.subcategories.map(sub => ({
          name: sub.name
        })),
        image: null // Set to null if no new image
      };

      // If there's a new image, handle it separately with FormData
      if (selectedCategory.image instanceof File) {
        const formData = new FormData();
        formData.append('image', selectedCategory.image);
        formData.append('name', updateData.name);
        formData.append('subcategories', JSON.stringify(updateData.subcategories));
        formData.append('id', updateData.id);
        
        await updateCategory(selectedCategory.id, formData);
      } else {
        // If no new image, send JSON data directly
        await updateCategory(selectedCategory.id, updateData);
      }

      await loadCategories();
      setShowEditCategory(false);
      setSelectedCategory(null);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update category');
    }
  };

  const handleCreateCategory = async () => {
    try {
      setErrorMessage('');
      if (!newCategory.name.trim()) {
        setErrorMessage('Category name is required');
        return;
      }
      
      const formData = new FormData();
      formData.append('name', newCategory.name);
      if (newCategory.image instanceof File) {
        formData.append('image', newCategory.image);
      }
      
      // Add empty subcategories array if none exist
      formData.append('subcategories', JSON.stringify([]));
      
      await createCategory(formData);
      await loadCategories();
      setShowAddCategory(false);
      setNewCategory({ name: '', image: '', subcategories: [] });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create category');
    }
  };

  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      if (isEdit) {
        setSelectedCategory({ ...selectedCategory, image: file });
      } else {
        setNewCategory({ ...newCategory, image: file });
      }
    }
  };

  const addCategoryModalContent = (
    <div className="space-y-4">
      {errorMessage && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg">
          {errorMessage}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category Name
        </label>
        <input
          type="text"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 "
          
        />
      </div>
      <button
        onClick={handleCreateCategory}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Category
      </button>
    </div>
  );

  const handleEditComposition = (composition) => {
    setSelectedComposition(composition);
    setShowEditComposition(true);
  };

  const handleDeleteComposition = (composition) => {
    setSelectedComposition(composition);
    setShowDeleteComposition(true);
  };

  const handleSaveComposition = async () => {
    try {
      await updateComposition(selectedComposition.id, {
        material: selectedComposition.material
      });
      await loadCompositions();
      setShowEditComposition(false);
      setSelectedComposition(null);
    } catch (err) {
      setError('Failed to update composition');
    }
  };

  const handleCreateComposition = async () => {
    try {
      if (!newComposition.material.trim()) {
        setErrorMessage('Material name is required');
        return;
      }
      await createComposition({
        material: newComposition.material
      });
      await loadCompositions();
      setShowAddComposition(false);
      setNewComposition({ material: '' });
    } catch (err) {
      setError('Failed to create composition');
    }
  };

  const confirmDeleteComposition = async () => {
    try {
      await deleteComposition(selectedComposition.id);
      await loadCompositions();
      setShowDeleteComposition(false);
      setSelectedComposition(null);
    } catch (err) {
      setError('Failed to delete composition');
    }
  };

  const handleViewProducts = async (categoryId) => {
    try {
      // Toggle expansion state
      if (expandedCategory === categoryId) {
        setExpandedCategory(null);
        return;
      }

      setExpandedCategory(categoryId);
      setErrorMessage('');
      setLoadingProducts(true);

      console.log('Fetching products for category:', categoryId); // Debug log
      const products = await fetchCategoryProducts(categoryId);
      console.log('Fetched products:', products); // Debug log

      setCategoryProducts(prev => ({
        ...prev,
        [categoryId]: products
      }));
    } catch (error) {
      console.error('Error loading products:', error);
      setErrorMessage(error.message || 'Failed to load products');
      setExpandedCategory(null);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditProduct(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setShowDeleteProduct(true);
  };

  const confirmDeleteProduct = async () => {
    try {
      await deleteProduct(selectedProduct.id);
      // Refresh products for the current category
      if (expandedCategory) {
        const products = await fetchCategoryProducts(expandedCategory);
        setCategoryProducts(prev => ({
          ...prev,
          [expandedCategory]: products
        }));
      }
      setShowDeleteProduct(false);
      setSelectedProduct(null);
    } catch (error) {
      setError('Failed to delete product');
      setErrorMessage(error.message || 'Failed to delete product');
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      await updateProduct(selectedProduct.id, productData);
      // Refresh products for the current category
      if (expandedCategory) {
        const products = await fetchCategoryProducts(expandedCategory);
        setCategoryProducts(prev => ({
          ...prev,
          [expandedCategory]: products
        }));
      }
      setShowEditProduct(false);
      setSelectedProduct(null);
    } catch (error) {
      setError('Failed to update product');
      setErrorMessage(error.message || 'Failed to update product');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('categories')}
              className={`${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('compositions')}
              className={`${
                activeTab === 'compositions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Compositions
            </button>
          </nav>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === 'categories' ? 'Category Management' : 'Composition Management'}
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => activeTab === 'categories' ? setShowAddCategory(true) : setShowAddComposition(true)}
              className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add {activeTab === 'categories' ? 'Category' : 'Composition'}
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'categories' ? (
          <div className="grid grid-cols-1 gap-6">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="flex">
                  {/* Category Image */}
                  <div className="w-48 h-48 flex-shrink-0">
                    <img
                      src={`http://127.0.0.1:8000${category.image}`}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Category Info */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {category.subcategories.length} Subcategories
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Category"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleAddProduct(category.id)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Add Product"
                        >
                          <PlusIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Category"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleViewProducts(category.id)}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center"
                          title="View Products"
                        >
                          <ListBulletIcon className="h-5 w-5 mr-1" />
                          {expandedCategory === category.id ? (
                            <ChevronUpIcon className="h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Subcategories */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700">Subcategories:</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {category.subcategories.map((sub) => (
                          <span
                            key={sub.id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {sub.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products Section */}
                {expandedCategory === category.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium text-gray-900">Products</h4>
                        <button
                          onClick={() => handleAddProduct(category.id)}
                          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Add Product
                        </button>
                      </div>

                      {loadingProducts ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      ) : errorMessage ? (
                        <div className="text-center py-8">
                          <div className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg">
                            <span className="mr-2">⚠️</span>
                            {errorMessage}
                          </div>
                        </div>
                      ) : categoryProducts[category.id]?.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr className="bg-gray-50">
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Product
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Style Number
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Subcategory
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {categoryProducts[category.id].map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="h-10 w-10 flex-shrink-0">
                                        <img
                                          src={`http://127.0.0.1:8000${product.image}`}
                                          alt={product.style_number}
                                          className="h-10 w-10 rounded-full object-cover"
                                        />
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                          {product.style_number}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.style_number}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                      {product.sub_category?.name}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-3">
                                      <button
                                        onClick={() => handleEditProduct(product)}
                                        className="text-blue-600 hover:text-blue-900"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteProduct(product)}
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No products found in this category
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : compositions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <PlusIcon className="h-12 w-12 mb-2" />
                <p className="text-lg">No compositions found</p>
                <p className="text-sm">Click the "Add Composition" button to create one</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Material Name
                        </th>
                        <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {compositions.map((composition, index) => (
                        <tr 
                          key={composition.id}
                          className={`
                            hover:bg-blue-50 transition-colors duration-150 ease-in-out
                            ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                          `}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">
                                  {composition.material.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {composition.material}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-3">
                              <button
                                onClick={() => handleEditComposition(composition)}
                                className="text-blue-600 hover:text-blue-900 flex items-center transition-colors duration-150"
                              >
                                <PencilIcon className="h-4 w-4 mr-1" />
                                <span>Edit</span>
                              </button>
                              <div className="h-4 w-px bg-gray-300"></div>
                              <button
                                onClick={() => handleDeleteComposition(composition)}
                                className="text-red-600 hover:text-red-900 flex items-center transition-colors duration-150"
                              >
                                <TrashIcon className="h-4 w-4 mr-1" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-50 px-6 py-4">
                  <div className="text-sm text-gray-500">
                    Total compositions: {compositions.length}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Add Category Modal */}
        <AnimatePresence>
          {showAddCategory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-lg p-6 w-full max-w-md"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Add New Category</h2>
                  <button onClick={() => setShowAddCategory(false)}>
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
                {addCategoryModalContent}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Category Modal */}
        <AnimatePresence>
          {showEditCategory && selectedCategory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-lg p-6 w-full max-w-md"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Edit Category</h2>
                  <button onClick={() => setShowEditCategory(false)}>
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={selectedCategory.name}
                      onChange={(e) =>
                        setSelectedCategory({ ...selectedCategory, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, true)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategories
                    </label>
                    <div className="space-y-2">
                      {selectedCategory.subcategories.map((subcategory) => (
                        <div
                          key={subcategory.id}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded"
                        >
                          <span>{subcategory.name}</span>
                          <button
                            onClick={() =>
                              setSelectedCategory({
                                ...selectedCategory,
                                subcategories: selectedCategory.subcategories.filter(
                                  (s) => s.id !== subcategory.id
                                ),
                              })
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={newSubcategory}
                        onChange={(e) => setNewSubcategory(e.target.value)}
                        placeholder="New subcategory"
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleAddSubcategory}
                        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleSaveCategory}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && selectedCategory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-lg p-6 w-full max-w-md"
              >
                <h2 className="text-xl font-semibold mb-4">Delete Category</h2>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{selectedCategory.name}"? This action cannot be
                  undone.
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Composition Modal */}
        <AnimatePresence>
          {showAddComposition && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Add New Composition</h2>
                    <p className="mt-1 text-sm text-gray-500">Add a new material composition to the system.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddComposition(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-400" />
                  </button>
                </div>
                {errorMessage && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{errorMessage}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material Name
                    </label>
                    <input
                      type="text"
                      value={newComposition.material}
                      onChange={(e) =>
                        setNewComposition({ ...newComposition, material: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter material name"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowAddComposition(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateComposition}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <PlusIcon className="h-5 w-5 mr-1" />
                      Create Composition
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Composition Modal */}
        <AnimatePresence>
          {showEditComposition && selectedComposition && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Edit Composition</h2>
                    <p className="mt-1 text-sm text-gray-500">Update the material composition details.</p>
                  </div>
                  <button 
                    onClick={() => setShowEditComposition(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-400" />
                  </button>
                </div>
                {errorMessage && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{errorMessage}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material Name
                    </label>
                    <input
                      type="text"
                      value={selectedComposition.material}
                      onChange={(e) =>
                        setSelectedComposition({
                          ...selectedComposition,
                          material: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowEditComposition(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveComposition}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <PencilIcon className="h-5 w-5 mr-1" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Composition Confirmation Modal */}
        <AnimatePresence>
          {showDeleteComposition && selectedComposition && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
              >
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <TrashIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold text-gray-900">Delete Composition</h2>
                    <p className="mt-1 text-sm text-gray-500">This action cannot be undone.</p>
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-700">
                    Are you sure you want to delete "{selectedComposition.material}"? This will remove the composition
                    from all products that use it.
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteComposition(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteComposition}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <TrashIcon className="h-5 w-5 mr-1" />
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Product Modal */}
        <AnimatePresence>
          {showEditProduct && selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Edit Product</h2>
                    <p className="mt-1 text-sm text-gray-500">Update the product details.</p>
                  </div>
                  <button 
                    onClick={() => setShowEditProduct(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-400" />
                  </button>
                </div>
                {errorMessage && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{errorMessage}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={selectedProduct.name}
                      onChange={(e) =>
                        setSelectedProduct({ ...selectedProduct, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Style Number
                    </label>
                    <input
                      type="text"
                      value={selectedProduct.style_number}
                      onChange={(e) =>
                        setSelectedProduct({ ...selectedProduct, style_number: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory
                    </label>
                    <input
                      type="text"
                      value={selectedProduct.sub_category?.name}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          sub_category: { ...selectedProduct.sub_category, name: e.target.value }
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setSelectedProduct({ ...selectedProduct, image: e.target.files[0] })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowEditProduct(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveProduct(selectedProduct)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <PencilIcon className="h-5 w-5 mr-1" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Product Confirmation Modal */}
        <AnimatePresence>
          {showDeleteProduct && selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
              >
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <TrashIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold text-gray-900">Delete Product</h2>
                    <p className="mt-1 text-sm text-gray-500">This action cannot be undone.</p>
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-700">
                    Are you sure you want to delete "{selectedProduct.name}"? This will remove the product
                    from all categories that it belongs to.
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteProduct(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteProduct}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <TrashIcon className="h-5 w-5 mr-1" />
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AdminHome;