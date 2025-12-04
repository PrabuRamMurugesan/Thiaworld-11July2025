import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getWishlist,
  toggleWishlist,
  bulkAddWishlist,
} from "../services/wishlistAPI";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [ids, setIds] = useState(new Set()); // productIds
  const [loading, setLoading] = useState(false);

  // Load from API if logged in; else keep guest localStorage
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await getWishlist(); // { ok, items: [{product:{_id,...}}] }
        if (res?.ok && Array.isArray(res.items)) {
          const set = new Set(res.items.map((it) => String(it.product._id)));
          if (!cancelled) setIds(set);
          // optional: sync guest localStorage into server after login
          const guest = JSON.parse(
            localStorage.getItem("guest_wishlist") || "[]"
          );
          if (guest.length) {
            await bulkAddWishlist(guest);
            localStorage.removeItem("guest_wishlist");
          }
        }
      } catch {
        // not logged in -> keep guest list only
        const guest = JSON.parse(
          localStorage.getItem("guest_wishlist") || "[]"
        );
        setIds(new Set(guest));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isWished = (pid) => ids.has(String(pid));

  const toggle = async (pid) => {
    const id = String(pid);
    try {
      const res = await toggleWishlist(id); // logged-in path
      const next = new Set(ids);
      if (res?.wished) next.add(id);
      else next.delete(id);
      setIds(next);
      
    } catch {
      // guest path -> localStorage
      const next = new Set(ids);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setIds(next);
      localStorage.setItem("guest_wishlist", JSON.stringify(Array.from(next)));
    }
  };
const refresh = async () => {
  try {
    const res = await getWishlist();
    if (res?.ok) {
      const set = new Set(res.items.map((it) => String(it.product._id)));
      setIds(set);
    }
  } catch {}
};

  const value = useMemo(
    () => ({ ids, isWished, toggle,refresh, loading }),
    [ids, loading]
  );
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
