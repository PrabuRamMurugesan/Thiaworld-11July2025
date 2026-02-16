import React, { useEffect, useState, useContext } from "react";
import { getWishlist, removeWishlist } from "../services/wishlistAPI";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useWishlist } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { pickFirstImageSrc, normalizeImages, buildImgSrc } from "../utils/imageTools";
import LoginPopup from "../components/LoginPopup";

// Format INR currency
function formatINR(n) {
  return Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// API origin helper
function apiOrigin() {
  const base =
    import.meta.env.VITE_API_URI || import.meta.env.VITE_API_URL || "";
  return base.replace(/\/api\/?$/, "");
}

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const { refresh } = useWishlist();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Check if user is logged in
  const isLoggedIn = () => {
    try {
      const stored = localStorage.getItem("bbsUser");
      return stored && JSON.parse(stored)?.token;
    } catch {
      return false;
    }
  };

  // Handle add to cart with login check
  const handleAddToCart = (product) => {
    if (!isLoggedIn()) {
      setShowLoginPopup(true);
      return;
    }
    addToCart(product);
  };

  // Load wishlist items
  const load = async () => {
    setLoading(true);
    try {
      const r = await getWishlist();
      setItems(r?.items || []);
      setErr("");
    } catch (e) {
      setErr("Please log in to view your wishlist.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Remove item from wishlist
  const onRemove = async (productId) => {
    try {
      await removeWishlist(productId);

      setItems((prev) =>
        prev.filter((it) => String(it.product._id) !== String(productId))
      );

      // update header count instantly
      refresh();
    } catch {}
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto my-8 px-4 text-center py-16">
          <div className="text-lg text-gray-600">Loading your wishlist...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (err) {
    return (
      <>
        <Header />
        <div className="container mx-auto my-8 px-4">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 text-center">
            {err}
          </div>
          <div className="text-center">
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            >
              Go to Login
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto my-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2
          className="font-bold mb-8 text-center"
          style={{
            color: "rgb(32, 32, 32)",
            borderBottom: "3px solid rgb(207, 162, 47)",
            paddingBottom: "15px",
            fontSize: "35px",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          My Wishlist
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Start adding products you love to your wishlist!
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              {items.length} {items.length === 1 ? "item" : "items"} in your wishlist
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((it) => {
                const product = it.product;
                const images = normalizeImages(product.images || []);
                const firstImage = pickFirstImageSrc(images);
                const productImage = buildImgSrc(firstImage);
                const productPrice = Number(product.price || product.finalPrice || product.breakdown?.salesPrice || 0);

                return (
                  <div
                    key={it._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-gray-200 "
                  >
                    {/* Product Image */}
                    <Link to={`/product/${product._id}`}>
                      <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                        <img
                          src={productImage}
                          alt={product.name || "Product"}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = "/default-product.jpg";
                          }}
                        />
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div className="p-4">
                      <div className="h-24 mb-2">
                        <Link to={`/product/${product._id}`}>
                        <h4 className="text-lg font-semibold text-gray-800 hover:text-yellow-600 transition-colors mb-2 line-clamp-2">
                          {product.name || "Product Name"}
                        </h4>
                      </Link>
                      
                      {product.purity && (
                        <p className="text-sm text-gray-600 mb-1">
                          Purity: {product.purity}
                        </p>
                      )}
                      {(product.netWeight || product.grossWeight) && (
                        <p className="text-sm text-gray-600 mb-2">
                          Weight: {product.netWeight || product.grossWeight}g
                        </p>
                      )}

                      
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                                <div className="mb-2">
                        <p className="text-xl font-bold text-yellow-700">
                          ₹{formatINR(productPrice)}
                        </p>
                      </div>
                        <Link
                          to={`/product/${product._id}`}
                          className="w-full text-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium text-sm"
                        >
                          View Details
                        </Link>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => onRemove(product._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                            title="Remove from wishlist"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continue Shopping Link */}
            <div className="text-center mt-8">
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Continue Shopping 
              </Link>
            </div>
          </>
        )}
      </div>
      <Footer />
      <LoginPopup
        show={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />
    </>
  );
};

export default WishlistPage;
