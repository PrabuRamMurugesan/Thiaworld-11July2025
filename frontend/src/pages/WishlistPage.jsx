import React, { useEffect, useState } from "react";
import { getWishlist, removeWishlist } from "../services/wishlistAPI";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      const r = await getWishlist();
      setItems(r?.items || []);
    } catch (e) {
      setErr("Please log in to view your wishlist.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRemove = async (productId) => {
    try {
      await removeWishlist(productId);
      setItems((prev) =>
        prev.filter((it) => String(it.product._id) !== String(productId))
      );
    } catch {}
  };

  if (err) return <div className="p-6 text-center">{err}</div>;

  return (
    <div className="container py-6">
      <h2 className="text-xl font-bold mb-4">My Wishlist</h2>
      <div className="d-flex flex-wrap gap-3">
        {items.map((it) => (
          <div
            key={it._id}
            className="border rounded p-3"
            style={{ width: 260 }}
          >
            <Link to={`/product/${it.product._id}`}>
              <img
                src={it.images?.[0] ? it.images[0] : "/default-product.jpg"}
                alt={it.product.name}
                style={{ width: 240, height: 240, objectFit: "cover" }}
              />
            </Link>
            <div className="mt-2">
              <div className="fw-bold">{it.product.name}</div>
              <div className="text-muted">
                ₹{Number(it.product.price || 0).toLocaleString("en-IN")}
              </div>
            </div>
            <div className="mt-2 d-flex gap-2">
              <Link
                to={`/product/${it.product._id}`}
                className="btn btn-sm btn-light"
              >
                View
              </Link>
              <button
                onClick={() => onRemove(it.product._id)}
                className="btn btn-sm btn-outline-danger"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {!items.length && <div>No items yet.</div>}
      </div>
    </div>
  );
};

export default WishlistPage;
