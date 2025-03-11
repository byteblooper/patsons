export const categories = [
    {
      id: "fc171cdc-aac4-453c-96a1-4643cae42d9b",
      name: "MENS changed PRODUCTS",
      image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=300&fit=crop",
      subcategories: [
        {
          id: "0b018b0c-c3d3-428d-b3c3-d1bd33369d15",
          name: "Mens Hoodie"
        },
        {
          id: "1ea9a96b-0add-49fa-afd1-e4b3e89d3ce2",
          name: "Mens T-Shirt"
        },
        {
          id: "5d476db8-8462-4c13-bdaf-d7d346b069fa",
          name: "Mens Sweater"
        }
      ]
    },
    {
      id: "ladies-products",
      name: "LADIES PRODUCTS",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop",
      subcategories: [
        {
          id: "ladies-sweater",
          name: "Ladies Sweater"
        },
        {
          id: "ladies-tshirt",
          name: "Ladies T-Shirt"
        },
        {
          id: "ladies-pants",
          name: "Ladies Pant & Shorts"
        }
      ]
    },
    {
      id: "girls-products",
      name: "GIRLS",
      image: "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?w=400&h=300&fit=crop",
      subcategories: [
        {
          id: "girls-dress",
          name: "Girls Dress"
        },
        {
          id: "girls-tops",
          name: "Girls Tops"
        }
      ]
    },
    {
      id: "boys-products",
      name: "BOYS",
      image: "https://images.unsplash.com/photo-1555009393-f20bdb245c4d?w=400&h=300&fit=crop",
      subcategories: [
        {
          id: "boys-sweater",
          name: "Boys Sweater"
        },
        {
          id: "boys-tshirt",
          name: "Boys T-Shirt"
        },
        {
          id: "boys-pants",
          name: "Boys Pants"
        }
      ]
    },
    {
      id: "jute-products",
      name: "JUTE",
      image: "https://images.unsplash.com/photo-1630750796085-38c8d1c5b3c1?w=400&h=300&fit=crop",
      subcategories: [
        {
          id: "jute-bags",
          name: "Jute Bags"
        },
        {
          id: "jute-accessories",
          name: "Jute Accessories"
        }
      ]
    }
  ];

function getCookie(name) {
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
    const response = await fetch(`http://127.0.0.1:8000/api/admin/products/${categoryId}`, {
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

export const createProduct = async (formData) => {
  try {
    // Debug log the FormData
    console.log('Sending FormData contents:');
    for (let [key, value] of formData.entries()) {
      if (key === 'composition') {
        console.log('composition:', JSON.parse(value));
      } else {
        console.log(`${key}:`, value);
      }
    }

    const response = await fetch('http://127.0.0.1:8000/api/admin/products/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCookie('csrftoken'),
      },
      credentials: 'include',
      body: formData
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