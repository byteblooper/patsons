import { useState } from 'react';
import { useInquiry } from '../context/InquiryContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { submitInquiry } from '../data/adminApi';

function Inquiry() {
  const navigate = useNavigate();
  const { inquiryItems, removeFromInquiry, clearInquiry } = useInquiry();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
    company: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare the data to be sent
      const inquiryData = {
        ...formData,
        products: inquiryItems.map(item => ({
          product_id: item.id,
          style_number: item.style_number
        }))
      };

      // Submit the inquiry using the adminApi function
      const response = await submitInquiry(inquiryData);
      
      if (response.status === 'success') {
        // Clear the inquiry cart
        clearInquiry();
        // Redirect to a success page or home
        navigate('/?inquiry=success');
      } else {
        throw new Error(response.message || 'Failed to submit inquiry');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Product Inquiry</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please review your selected items and provide your contact information. 
            Our team will get back to you with detailed product specifications and pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Selected Items */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-8"
            variants={containerVariants}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Selected Items</h2>
            <p className="text-gray-600 mb-6 pb-6 border-b">
              {inquiryItems.length} {inquiryItems.length === 1 ? 'item' : 'items'} selected for inquiry
            </p>
            
            <div className="space-y-6">
              {inquiryItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="flex items-start gap-6 bg-gray-50 p-4 rounded-xl transition-all hover:shadow-md"
                >
                  <div className="w-32 h-32 overflow-hidden rounded-lg">
                    <img
                      src={item.image}
                      alt={item.description}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.style_number}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.composition?.map((comp, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                        >
                          {comp.material}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromInquiry(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </motion.div>
              ))}

              {inquiryItems.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No items in your inquiry list</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-8"
            variants={containerVariants}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
            <p className="text-gray-600 mb-6 pb-6 border-b">
              Fill out the form below to submit your inquiry
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Your Company Ltd."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="What's your inquiry about?"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Please provide any additional details about your inquiry..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || inquiryItems.length === 0}
                className={`w-full py-3 px-6 rounded-lg font-medium transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : inquiryItems.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] text-white'
                  }`}
              >
                {loading ? 'Submitting...' : 'Submit Inquiry'}
              </button>
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                  {error}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Inquiry;