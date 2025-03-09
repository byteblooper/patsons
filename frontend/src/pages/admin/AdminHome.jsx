import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PencilIcon, 
  PlusIcon, 
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {  fetchCategories, createCategory, updateCategory, deleteCategory } from '../../data/adminApi';

function AdminHome() {
  const navigate = useNavigate();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newSubcategory, setNewSubcategory] = useState('');
  const [newCategory, setNewCategory] = useState({
    name: '',
    image: '',
    subcategories: []
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <button
            onClick={() => setShowAddCategory(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden group relative"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={`http://127.0.0.1:8000${category.image}`}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm">
                  {category.subcategories.length} Subcategories
                </p>
              </div>

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Edit Category"
                >
                  <PencilIcon className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => handleAddProduct(category.id)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Add Product"
                >
                  <PlusIcon className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Delete Category"
                >
                  <TrashIcon className="h-5 w-5 text-red-600" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

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
      </div>
    </div>
  );
}

export default AdminHome;