import { useContext, createContext } from "react";

// Context'i burada oluşturup ihraç edin
export const CartContext = createContext();

// `useCart` hook'unu burada oluşturup ihraç edin
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
