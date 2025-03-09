import { createContext, useContext, useState } from 'react';

const InquiryContext = createContext();

export function InquiryProvider({ children }) {
  const [inquiryItems, setInquiryItems] = useState([]);

  const addToInquiry = (product) => {
    setInquiryItems((prev) => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  const removeFromInquiry = (productId) => {
    setInquiryItems(prev => prev.filter(item => item.id !== productId));
  };

  const isInInquiry = (productId) => {
    return inquiryItems.some(item => item.id === productId);
  };

  return (
    <InquiryContext.Provider value={{
      inquiryItems,
      addToInquiry,
      removeFromInquiry,
      isInInquiry
    }}>
      {children}
    </InquiryContext.Provider>
  );
}

export const useInquiry = () => useContext(InquiryContext);