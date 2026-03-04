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
  if (!isLoggedIn()) {
    console.warn("User must be logged in to add items to cart");
    return false;
  }

  const raw = product.category || product.metalType || "";
  const cat = raw.toLowerCase();

  const updateCategoryCart = (cart, setCart, storageKey) => {
    const existing = cart.find(
      (item) => item._id === product._id
    );

    let updated;

    if (existing) {
      updated = cart.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity: (item.quantity || 1) + 1,
            }
          : item
      );
    } else {
      updated = [
        ...cart,
        {
          ...product,
          quantity: 1,
          cartItemId: generateCartItemId(),
        },
      ];
    }

    setCart(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  if (cat === "gold") {
    updateCategoryCart(goldCart, setGoldCart, "goldCart");
  } else if (cat === "silver") {
    updateCategoryCart(silverCart, setSilverCart, "silverCart");
  } else if (cat === "diamond") {
    updateCategoryCart(diamondCart, setDiamondCart, "diamondCart");
  } else if (cat === "platinum") {
    updateCategoryCart(platinumCart, setPlatinumCart, "platinumCart");
  } else {
    console.warn("Unknown category", raw, product);
  }

  return true;
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
