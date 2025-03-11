import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Inquiry from './pages/Inquiry';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminHome from './pages/admin/AdminHome';
import AddProduct from './pages/admin/AddProduct';
import { InquiryProvider } from './context/InquiryContext';
import CategoryWiseProducts from './pages/admin/CategoryWiseProducts';

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
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/inquiry" element={<Inquiry />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/admin/category/:categoryId/add-product" element={<AddProduct />} />
              <Route path="/admin/category/:categoryId/products" element={<CategoryWiseProducts />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </InquiryProvider>
  );
}

export default App;