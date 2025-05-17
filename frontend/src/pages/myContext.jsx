import React, { createContext, useContext, useEffect, useState } from "react";

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const CartProvider = ({ children }) => {
  const [quantities, setQuantities] = useState({});

  // Load on mount
  useEffect(() => {
    const stored = localStorage.getItem("quantities");
    if (stored) setQuantities(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("quantities", JSON.stringify(quantities));
  }, [quantities]);

  const increment = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const decrement = (id) => {
    setQuantities((prev) => {
      const updated = Math.max((prev[id] || 1) - 1, 1);
      return { ...prev, [id]: updated };
    });
  };

  const setInitial = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] || 1,
    }));
  };

  return (
    <CartContext.Provider value={{ quantities, increment, decrement, setInitial }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
