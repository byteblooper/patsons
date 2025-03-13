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

export const fetchCategories = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/admin/categories/', {
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
      credentials: 'include',
    });
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
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
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
    const response = await fetch(`http://127.0.0.1:8000/api/admin/categorised-products/${categoryId}`, {
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createProduct = async (data) => {
  try {
    console.log('Sending data:', data);

    const response = await fetch('http://127.0.0.1:8000/api/admin/products/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

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

export const updateProduct = async (productId, formData) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/admin/products/${productId}/`, {
      method: 'PUT',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
      credentials: 'include',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update product');
    }
    return await response.json();
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
        'X-CSRFToken': getCookie('csrftoken'),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to delete product');
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
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
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
    const response = await fetch('http://127.0.0.1:8000/api/compositions/', {
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch compositions');
    return await response.json();
  } catch (error) {
    console.error('Error fetching compositions:', error);
    throw error;
  }
};