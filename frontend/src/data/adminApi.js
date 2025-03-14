import { getValidToken, handleUnauthorizedResponse } from '../utils/auth';

export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Add a helper function to get headers with authorization
const getAuthHeaders = () => {
  const token = getValidToken();
  if (!token) return null;

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-CSRFToken': getCookie('csrftoken'),
  };
};

export const fetchCategories = async () => {
  try {
    const headers = getAuthHeaders();
    if (!headers) return;

    const response = await fetch('http://127.0.0.1:8000/api/admin/categories/', {
      headers,
      credentials: 'include',
    });
    
    if (response.status === 401) {
      handleUnauthorizedResponse({ response });
      return;
    }
    
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const createCategory = async (formData) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/admin/categories/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-CSRFToken': getCookie('csrftoken'),
      },
      credentials: 'include',
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Handle validation errors
      if (data.name) {
        throw new Error(data.name[0]);
      }
      if (data.image) {
        throw new Error(data.image[0]);
      }
      throw new Error(data.detail || 'Failed to create category');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (categoryId, data) => {
  try {
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      'X-CSRFToken': getCookie('csrftoken'),
    };

    // If data is FormData, don't set Content-Type (browser will set it)
    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      data = JSON.stringify(data);
    }

    const response = await fetch(`http://127.0.0.1:8000/api/admin/categories/${categoryId}/`, {
      method: 'PUT',
      headers: headers,
      credentials: 'include',
      body: data
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update category');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/admin/categories/${categoryId}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to delete category');
    }
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const fetchCategoryProducts = async (categoryId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/admin/categorised-products/${categoryId}/`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch products');
    }

    const data = await response.json();
    console.log('API Response:', data); // Debug log
    
    // Check if data is an array directly or has a products property
    if (Array.isArray(data)) {
      return data;
    } else if (data.products && Array.isArray(data.products)) {
      return data.products;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching category products:', error);
    throw error;
  }
};

export const createProduct = async (data) => {
  try {
    // If data is FormData, don't include Content-Type header
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      'X-CSRFToken': getCookie('csrftoken'),
    };

    // Only add Content-Type if not sending FormData
    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      data = JSON.stringify(data);
    }

    const response = await fetch('http://127.0.0.1:8000/api/admin/products/', {
      method: 'POST',
      headers: headers,
      credentials: 'include',
      body: data
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('API Error Response:', responseData);
      throw new Error(responseData.detail || responseData.error || 'Failed to create product');
    }

    return responseData;
  } catch (error) {
    console.error('Error in createProduct:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const formData = new FormData();
    
    // Append all product data to formData
    Object.keys(productData).forEach(key => {
      if (key === 'image' && productData[key] instanceof File) {
        formData.append('image', productData[key]);
      } else if (key === 'images' && Array.isArray(productData[key])) {
        productData[key].forEach((file, index) => {
          formData.append(`images[${index}]`, file);
        });
      } else {
        formData.append(key, productData[key]);
      }
    });

    const response = await fetch(`http://127.0.0.1:8000/api/admin/products/${productId}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-CSRFToken': getCookie('csrftoken'),
      },
      credentials: 'include',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/admin/products/${productId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'X-CSRFToken': getCookie('csrftoken'),
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const fetchSubcategories = async (categoryId) => {
  if (!categoryId) {
    throw new Error('Category ID is required');
  }

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/admin/subcategories/${categoryId}/`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch subcategories');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};

export const fetchCompositions = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/admin/compositions/', {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch compositions');
    return await response.json();
  } catch (error) {
    console.error('Error fetching compositions:', error);
    throw error;
  }
};

export const createComposition = async (data) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/admin/compositions/', {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create composition');
    return await response.json();
  } catch (error) {
    console.error('Error creating composition:', error);
    throw error;
  }
};

export const updateComposition = async (id, data) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/admin/compositions/${id}/`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update composition');
    return await response.json();
  } catch (error) {
    console.error('Error updating composition:', error);
    throw error;
  }
};

export const deleteComposition = async (id) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/admin/compositions/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete composition');
    return true;
  } catch (error) {
    console.error('Error deleting composition:', error);
    throw error;
  }
};