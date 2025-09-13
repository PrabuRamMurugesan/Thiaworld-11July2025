// ✅ src/context/CartContext.jsx
import React, { createContext, useEffect, useMemo, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [goldCart, setGoldCart] = useState([]);
  const [silverCart, setSilverCart] = useState([]);
  const [diamondCart, setDiamondCart] = useState([]);
  const [platinumCart, setPlatinumCart] = useState([]);

  // helper: write merged cart to localStorage + notify
  const persist = (next) => {
    try {
      localStorage.setItem("cart", JSON.stringify(next));
      // inform listeners like Header
      window.dispatchEvent(new Event("storageUpdate"));
    } catch {}
  };

  const addToCart = (product) => {
    console.log("✅ Adding to cart:", product);

    // normalize category
    const cat = product.category || product.metalType;
    if (cat === "Gold") setGoldCart((prev) => [...prev, product]);
    else if (cat === "Silver") setSilverCart((prev) => [...prev, product]);
    else if (cat === "Diamond") setDiamondCart((prev) => [...prev, product]);
    else if (cat === "Platinum") setPlatinumCart((prev) => [...prev, product]);
    else console.warn("Unknown category", product);
  };

  const removeFromCart = (id, category) => {
    if (category === "Gold") setGoldCart((p) => p.filter((x) => x._id !== id));
    else if (category === "Silver")
      setSilverCart((p) => p.filter((x) => x._id !== id));
    else if (category === "Diamond")
      setDiamondCart((p) => p.filter((x) => x._id !== id));
    else if (category === "Platinum")
      setPlatinumCart((p) => p.filter((x) => x._id !== id));
  };

  const clearCart = (category) => {
    if (category === "Gold") setGoldCart([]);
    else if (category === "Silver") setSilverCart([]);
    else if (category === "Diamond") setDiamondCart([]);
    else if (category === "Platinum") setPlatinumCart([]);
  };

  // merged cart + count
  const mergedCart = useMemo(
    () => [...goldCart, ...silverCart, ...diamondCart, ...platinumCart],
    [goldCart, silverCart, diamondCart, platinumCart]
  );
  const cartCount = useMemo(
    () => mergedCart.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [mergedCart]
  );

  // persist whenever the cart changes
  useEffect(() => {
    persist(mergedCart);
  }, [mergedCart]);

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
        cartCount, // <-- expose this
        mergedCart, // optional, if needed elsewhere
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
