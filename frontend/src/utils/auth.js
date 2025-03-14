// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiry;
  } catch (error) {
    return true;
  }
};

// Get valid token or redirect to login
export const getValidToken = () => {
  const token = localStorage.getItem('access_token');
  
  if (!token || isTokenExpired(token)) {
    // Clear all auth data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Redirect to login
    window.location.href = '/admin/login';
    return null;
  }
  
  return token;
};

// Axios interceptor to handle unauthorized responses
export const handleUnauthorizedResponse = (error) => {
  if (error.response && error.response.status === 401) {
    // Clear auth data and redirect to login
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  }
  return Promise.reject(error);
}; 