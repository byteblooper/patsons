export const products = [
  {
    id: "6f3b1aab-0bf7-4016-a84a-469262b21309",
    style_number: "KW2023-001",
    gauge: "test 1",
    end: "test 1",
    weight: "test 1",
    description: "test 1",
    category: {
      id: "fc171cdc-aac4-453c-96a1-4643cae42d9b",
      name: "MENS PRODUCTS"
    },
    sub_category: {
      id: "1ea9a96b-0add-49fa-afd1-e4b3e89d3ce2",
      name: "Mens T-Shirt"
    },
    composition: [
      {
        id: "55dd012b-8797-48bf-9b4b-db345142976a",
        material: "wool"
      }
    ],
    images: [
      {
        id: "c7fd4c86-93c3-4227-86b7-046576f12bd4",
        image: "/media/product_images/mens_4G5uTDI.jpg"
      }
    ]
  },
  {
    id: "ec8f083c-a39c-4fdf-a9fa-60c674ff03b7",
    style_number: "KW2023-002",
    gauge: "test 1",
    end: "test 1",
    weight: "test 1",
    description: "test 1",
    category: {
      id: "ladies-products",
      name: "LADIES PRODUCTS"
    },
    sub_category: {
      id: "ladies-tshirt",
      name: "Ladies T-Shirt"
    },
    composition: [
      {
        id: "b311e9af-fa06-4607-a73d-7db703baf33f",
        material: "wool"
      }
    ],
    images: [
      {
        id: "d1fd4c86-93c3-4227-86b7-046576f12bd5",
        image: "/media/product_images/womens_DUSTQBz.jpg"
      }
    ]
  },
  {
    id: "86b173ba-9471-4ce0-867e-ad3d200d03e5",
    style_number: "KW2023-003",
    gauge: "test 1",
    end: "test 1",
    weight: "test 1",
    description: "test 1",
    category: {
      id: "fc171cdc-aac4-453c-96a1-4643cae42d9b",
      name: "MENS PRODUCTS"
    },
    sub_category: {
      id: "0b018b0c-c3d3-428d-b3c3-d1bd33369d15",
      name: "Mens Hoodie"
    },
    composition: [
      {
        id: "b311e9af-fa06-4607-a73d-7db703baf33f",
        material: "fool"
      }
    ],
    images: [
      {
        id: "e2fd4c86-93c3-4227-86b7-046576f12bd6",
        image: "/media/product_images/mens_vYqg1dq.jpg"
      }
    ]
  }
];


export const categories = [
  {
    id: "fc171cdc-aac4-453c-96a1-4643cae42d9b",
    name: "MENS PRODUCTS",
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

export const fetchAllProducts = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/products/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch products');
    }
    
    const data = await response.json();
    console.log('Products response:', data); // Debug log
    return data.products || data;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return mock data as fallback
    return products;
  }
};

export const fetchAllCategories = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/categories/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch categories');
    }
    
    const data = await response.json();
    console.log('Categories response:', data); // Debug log
    return data.categories || data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return mock data as fallback
    return categories;
  }
};

export const fetchCategoryProducts = async (categoryId) => {
  try {
    // Fetch all products and filter by category
    const response = await fetch('http://127.0.0.1:8000/api/products/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch products');
    }
    
    const data = await response.json();
    console.log('All products response:', data); // Debug log
    
    // Get products array from response
    const allProducts = data.products || data;
    
    // Filter products by category
    const categoryProducts = allProducts.filter(product => 
      product.category?.id === categoryId
    );
    
    console.log('Filtered category products:', categoryProducts); // Debug log
    return categoryProducts;
  } catch (error) {
    console.error('Error fetching category products:', error);
    // Return filtered mock data as fallback
    return products.filter(p => p.category?.id === categoryId);
  }
};

export const fetchSubcategoryProducts = async (categoryId, subcategoryId) => {
  try {
    // Fetch all products and filter by category and subcategory
    const response = await fetch('http://127.0.0.1:8000/api/products/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch products');
    }
    
    const data = await response.json();
    console.log('All products response:', data); // Debug log
    
    // Get products array from response
    const allProducts = data.products || data;
    
    // Filter products by category and subcategory
    const subcategoryProducts = allProducts.filter(product => 
      product.category?.id === categoryId && 
      product.sub_category?.id === subcategoryId
    );
    
    console.log('Filtered subcategory products:', subcategoryProducts); // Debug log
    return subcategoryProducts;
  } catch (error) {
    console.error('Error fetching subcategory products:', error);
    // Return filtered mock data as fallback
    return products.filter(p => 
      p.category?.id === categoryId && 
      p.sub_category?.id === subcategoryId
    );
  }
};

export const fetchProductDetails = async (productId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch product details');
    }
    
    const data = await response.json();
    console.log('Product details response:', data); // Debug log
    return data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    // Return mock product as fallback
    return products.find(p => p.id === productId);
  }
};