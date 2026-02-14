import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [goldCart, setGoldCart] = useState([]);
  const [silverCart, setSilverCart] = useState([]);
  const [diamondCart, setDiamondCart] = useState([]);
  const [platinumCart, setPlatinumCart] = useState([]);

  const [mergedCart, setMergedCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // ------------------------------
  // LOAD CART FROM LOCAL STORAGE
  // ------------------------------
useEffect(() => {
  const safeLoad = (key) => {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  };

  setGoldCart(safeLoad("goldCart"));
  setSilverCart(safeLoad("silverCart"));
  setDiamondCart(safeLoad("diamondCart"));
  setPlatinumCart(safeLoad("platinumCart"));
}, []);


  // ------------------------------
  // MERGE CARTS + UPDATE COUNT
  // ------------------------------
useEffect(() => {
  const merged = [
    ...(goldCart || []),
    ...(silverCart || []),
    ...(diamondCart || []),
    ...(platinumCart || []),
  ];

  setMergedCart(merged);
  setCartCount(merged.length);

  window.dispatchEvent(new Event("storageUpdate"));
}, [goldCart, silverCart, diamondCart, platinumCart]);


  // ------------------------------
  // CHECK IF USER IS LOGGED IN
  // ------------------------------
  const isLoggedIn = () => {
    try {
      const stored = localStorage.getItem("bbsUser");
      return stored && JSON.parse(stored)?.token;
    } catch {
      return false;
    }
  };

  // Generate unique ID for each cart item
  const generateCartItemId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // ------------------------------
  // ADD TO CART
  // ------------------------------
  const addToCart = (product) => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      console.warn("User must be logged in to add items to cart");
      return false; // Return false to indicate failure
    }

    const raw = product.category || product.metalType || "";
    const cat = raw.toLowerCase();

    // Add unique cartItemId to each product
    const itemWithId = {
      ...product,
      cartItemId: generateCartItemId()
    };

    if (cat === "gold") {
      const updated = [...goldCart, itemWithId];
      setGoldCart(updated);
      localStorage.setItem("goldCart", JSON.stringify(updated));
    } else if (cat === "silver") {
      const updated = [...silverCart, itemWithId];
      setSilverCart(updated);
      localStorage.setItem("silverCart", JSON.stringify(updated));
    } else if (cat === "diamond") {
      const updated = [...diamondCart, itemWithId];
      setDiamondCart(updated);
      localStorage.setItem("diamondCart", JSON.stringify(updated));
    } else if (cat === "platinum") {
      const updated = [...platinumCart, itemWithId];
      setPlatinumCart(updated);
      localStorage.setItem("platinumCart", JSON.stringify(updated));
    } else {
      console.warn("Unknown category", raw, product);
    }
    return true; // Return true to indicate success
  };

  // ------------------------------
  // REMOVE ITEM (by unique cartItemId, not product _id)
  // ------------------------------
  const removeFromCart = (cartItemId, category) => {
    const cat = category.toLowerCase();

    if (cat === "gold") {
      const updated = goldCart.filter((i) => i.cartItemId !== cartItemId);
      setGoldCart(updated);
      localStorage.setItem("goldCart", JSON.stringify(updated));
    } else if (cat === "silver") {
      const updated = silverCart.filter((i) => i.cartItemId !== cartItemId);
      setSilverCart(updated);
      localStorage.setItem("silverCart", JSON.stringify(updated));
    } else if (cat === "diamond") {
      const updated = diamondCart.filter((i) => i.cartItemId !== cartItemId);
      setDiamondCart(updated);
      localStorage.setItem("diamondCart", JSON.stringify(updated));
    } else if (cat === "platinum") {
      const updated = platinumCart.filter((i) => i.cartItemId !== cartItemId);
      setPlatinumCart(updated);
      localStorage.setItem("platinumCart", JSON.stringify(updated));
    }
  };

  // ------------------------------
  // CLEAR SPECIFIC CATEGORY
  // ------------------------------
  const clearCart = (category) => {
    const cat = category.toLowerCase();

    if (cat === "gold") {
      setGoldCart([]);
      localStorage.setItem("goldCart", "[]");
    } else if (cat === "silver") {
      setSilverCart([]);
      localStorage.setItem("silverCart", "[]");
    } else if (cat === "diamond") {
      setDiamondCart([]);
      localStorage.setItem("diamondCart", "[]");
    } else if (cat === "platinum") {
      setPlatinumCart([]);
      localStorage.setItem("platinumCart", "[]");
    }
  };

  // ------------------------------
  // CLEAR ALL CARTS
  // ------------------------------
  const clearAll = () => {
    setGoldCart([]);
    setSilverCart([]);
    setDiamondCart([]);
    setPlatinumCart([]);

    localStorage.setItem("goldCart", "[]");
    localStorage.setItem("silverCart", "[]");
    localStorage.setItem("diamondCart", "[]");
    localStorage.setItem("platinumCart", "[]");
  };

  return (
    <CartContext.Provider
      value={{
        goldCart,
        silverCart,
        diamondCart,
        platinumCart,
        mergedCart,
        cartCount,
        addToCart,
        removeFromCart,
        clearCart,
        clearAll,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
