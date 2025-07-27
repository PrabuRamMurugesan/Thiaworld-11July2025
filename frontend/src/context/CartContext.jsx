// ✅ src/context/CartContext.jsx
import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [goldCart, setGoldCart] = useState([]);
  const [silverCart, setSilverCart] = useState([]);
  const [diamondCart, setDiamondCart] = useState([]);
  const [platinumCart, setPlatinumCart] = useState([]);

  const addToCart = (product) => {
    console.log("✅ Adding to cart:", product);

    const cat = product.category || product.metalType;
    if (cat === "Gold") setGoldCart((prev) => [...prev, product]);
    else if (cat === "Silver") setSilverCart((prev) => [...prev, product]);
    else if (cat === "Diamond") setDiamondCart((prev) => [...prev, product]);
    else if (cat === "Platinum") setPlatinumCart((prev) => [...prev, product]);
    else console.warn("Unknown category", product);
  };

  const removeFromCart = (id, category) => {
    if (category === "Gold")
      setGoldCart((prev) => prev.filter((p) => p._id !== id));
    else if (category === "Silver")
      setSilverCart((prev) => prev.filter((p) => p._id !== id));
    else if (category === "Diamond")
      setDiamondCart((prev) => prev.filter((p) => p._id !== id));
    else if (category === "Platinum")
      setPlatinumCart((prev) => prev.filter((p) => p._id !== id));
  };

  const clearCart = (category) => {
    if (category === "Gold") setGoldCart([]);
    else if (category === "Silver") setSilverCart([]);
    else if (category === "Diamond") setDiamondCart([]);
    else if (category === "Platinum") setPlatinumCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        goldCart,
        silverCart,
        diamondCart,
        platinumCart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

