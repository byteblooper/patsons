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

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('access_token');
  
  if (!isAuthenticated) {
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
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </InquiryProvider>
  );
}

export default App;