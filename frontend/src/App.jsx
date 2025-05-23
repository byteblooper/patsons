import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Inquiry from './pages/Inquiry';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminHome from './pages/admin/AdminHome';
import AddProduct from './pages/admin/AddProduct';
import Login from './pages/admin/Login';
import { InquiryProvider } from './context/InquiryContext';
import CategoryWiseProducts from './pages/admin/CategoryWiseProducts';
import EditProduct from './pages/admin/EditProduct';
import { isTokenExpired } from './utils/auth';
// import Login from './pages/Login';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  
  if (!token || isTokenExpired(token)) {
    // Clear auth data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

function App() {
  return (
    <InquiryProvider>
      <Router>
        <div className="min-h-screen bg-white flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/inquiry" element={<Inquiry />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<Login />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminHome />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/category/:categoryId/add-product" 
                element={
                  <ProtectedRoute>
                    <AddProduct />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/category/:categoryId/products" 
                element={
                  <ProtectedRoute>
                    <CategoryWiseProducts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/category/:categoryId/edit-product/:productId" 
                element={
                  <ProtectedRoute>
                    <EditProduct />
                  </ProtectedRoute>
                } 
              />

            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </InquiryProvider>
  );
}

export default App;