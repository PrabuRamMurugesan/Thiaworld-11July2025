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
  // ADD TO CART
  // ------------------------------
  const addToCart = (product) => {
    const raw = product.category || product.metalType || "";
    const cat = raw.toLowerCase();

    if (cat === "gold") {
      const updated = [...goldCart, product];
      setGoldCart(updated);
      localStorage.setItem("goldCart", JSON.stringify(updated));
    } else if (cat === "silver") {
      const updated = [...silverCart, product];
      setSilverCart(updated);
      localStorage.setItem("silverCart", JSON.stringify(updated));
    } else if (cat === "diamond") {
      const updated = [...diamondCart, product];
      setDiamondCart(updated);
      localStorage.setItem("diamondCart", JSON.stringify(updated));
    } else if (cat === "platinum") {
      const updated = [...platinumCart, product];
      setPlatinumCart(updated);
      localStorage.setItem("platinumCart", JSON.stringify(updated));
    } else {
      console.warn("Unknown category", raw, product);
    }
  };

  // ------------------------------
  // REMOVE ITEM
  // ------------------------------
  const removeFromCart = (id, category) => {
    const cat = category.toLowerCase();

    if (cat === "gold") {
      const updated = goldCart.filter((i) => i._id !== id);
      setGoldCart(updated);
      localStorage.setItem("goldCart", JSON.stringify(updated));
    } else if (cat === "silver") {
      const updated = silverCart.filter((i) => i._id !== id);
      setSilverCart(updated);
      localStorage.setItem("silverCart", JSON.stringify(updated));
    } else if (cat === "diamond") {
      const updated = diamondCart.filter((i) => i._id !== id);
      setDiamondCart(updated);
      localStorage.setItem("diamondCart", JSON.stringify(updated));
    } else if (cat === "platinum") {
      const updated = platinumCart.filter((i) => i._id !== id);
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
