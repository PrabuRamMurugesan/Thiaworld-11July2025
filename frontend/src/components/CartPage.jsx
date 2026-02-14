// ✅ src/pages/CartPage.jsx
import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { pickFirstImageSrc, normalizeImages } from "../utils/imageTools";

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

// Build image source helper
function buildImgSrc(img) {
  if (!img) return "/default-product.jpg";
  if (/^https?:\/\//i.test(img)) return img;
  const base = apiOrigin();
  if (img.startsWith("/uploads/")) return `${base}${img}`;
  return `${base}/uploads/${img}`;
}

const CartPage = () => {
  const {
    goldCart,
    silverCart,
    diamondCart,
    platinumCart,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);
  const [selectedImage, setSelectedImage] = useState(""); 

  const goldTotal = goldCart.reduce((sum, item) => sum + Number(item.price || item.finalPrice || 0), 0);
  const silverTotal = silverCart.reduce((sum, item) => sum + Number(item.price || item.finalPrice || 0), 0);
  const diamondTotal = diamondCart.reduce((sum, item) => sum + Number(item.price || item.finalPrice || 0), 0);
  const platinumTotal = platinumCart.reduce((sum, item) => sum + Number(item.price || item.finalPrice || 0), 0);
  const grandTotal = goldTotal + silverTotal + diamondTotal + platinumTotal;

  // Check if cart is empty
  const isCartEmpty = grandTotal === 0;

  // Render product card component
  const renderProductCard = (item, category) => {
    const images = normalizeImages(item.images || []);
    const firstImage = pickFirstImageSrc(images);
    const productImage = buildImgSrc(firstImage);
    const itemPrice = Number(item.price || item.finalPrice || item.breakdown?.salesPrice || 0);

    return (
      <div
        key={item.cartItemId || item._id}
        className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow duration-200"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <Link to={`/product/${item._id}`}>
              <img
                src={productImage}
                alt={item.name || "Product"}
                className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg border-2 border-gray-200 hover:border-yellow-500 transition-colors"
                onError={(e) => {
                  e.currentTarget.src = "/default-product.jpg";
                }}
              />
            </Link>
          </div>

          {/* Product Details */}
          <div className="flex-grow flex flex-col justify-between">
            <div>
              <Link to={`/product/${item._id}`}>
                <h4 className="text-lg font-semibold text-gray-800 hover:text-yellow-600 transition-colors mb-2">
                  {item.name || "Product Name"}
                </h4>
              </Link>
              {item.purity && (
                <p className="text-sm text-gray-600 mb-1">
                  Purity: {item.purity}
                </p>
              )}
              {(item.netWeight || item.grossWeight) && (
                <p className="text-sm text-gray-600 mb-1">
                  Weight: {item.netWeight || item.grossWeight}g
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-xl font-bold text-yellow-700">
                  ₹{formatINR(itemPrice)}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.cartItemId || item._id, category)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="container mx-auto my-8 px-4 sm:px-6 lg:px-8">
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
          My Cart
        </h2>

        {isCartEmpty ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Add some beautiful jewelry to your cart!
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Product List */}
              <div className="lg:col-span-2">
                {/* ✅ GOLD PRODUCTS */}
                {goldCart.length > 0 && (
                  <div className="mb-8">
                    <h3
                      className="text-xl font-semibold mb-4 pb-2 border-b-2"
                      style={{ color: "rgb(207, 162, 47)" }}
                    >
                      Gold Products ({goldCart.length})
                    </h3>
                    {goldCart.map((item) => renderProductCard(item, "Gold"))}
                    <div className="text-right mt-4 mb-6">
                      <p className="text-lg font-semibold text-gray-700">
                        Gold Subtotal: <span className="text-yellow-700">₹{formatINR(goldTotal)}</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* ✅ SILVER PRODUCTS */}
                {silverCart.length > 0 && (
                  <div className="mb-8">
                    <h3
                      className="text-xl font-semibold mb-4 pb-2 border-b-2"
                      style={{ color: "rgb(135, 135, 135)" }}
                    >
                      Silver Products ({silverCart.length})
                    </h3>
                    {silverCart.map((item) => renderProductCard(item, "Silver"))}
                    <div className="text-right mt-4 mb-6">
                      <p className="text-lg font-semibold text-gray-700">
                        Silver Subtotal: <span className="text-yellow-700">₹{formatINR(silverTotal)}</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* ✅ DIAMOND PRODUCTS */}
                {diamondCart.length > 0 && (
                  <div className="mb-8">
                    <h3
                      className="text-xl font-semibold mb-4 pb-2 border-b-2"
                      style={{ color: "rgb(177, 179, 181)" }}
                    >
                      Diamond Products ({diamondCart.length})
                    </h3>
                    {diamondCart.map((item) => renderProductCard(item, "Diamond"))}
                    <div className="text-right mt-4 mb-6">
                      <p className="text-lg font-semibold text-gray-700">
                        Diamond Subtotal: <span className="text-yellow-700">₹{formatINR(diamondTotal)}</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* ✅ PLATINUM PRODUCTS */}
                {platinumCart.length > 0 && (
                  <div className="mb-8">
                    <h3
                      className="text-xl font-semibold mb-4 pb-2 border-b-2"
                      style={{ color: "rgb(153, 153, 153)" }}
                    >
                      Platinum Products ({platinumCart.length})
                    </h3>
                    {platinumCart.map((item) => renderProductCard(item, "Platinum"))}
                    <div className="text-right mt-4 mb-6">
                      <p className="text-lg font-semibold text-gray-700">
                        Platinum Subtotal: <span className="text-yellow-700">₹{formatINR(platinumTotal)}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-lg p-6 sticky top-4">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">
                    Order Summary
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    {goldCart.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Gold ({goldCart.length})</span>
                        <span className="font-medium">₹{formatINR(goldTotal)}</span>
                      </div>
                    )}
                    {silverCart.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Silver ({silverCart.length})</span>
                        <span className="font-medium">₹{formatINR(silverTotal)}</span>
                      </div>
                    )}
                    {diamondCart.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Diamond ({diamondCart.length})</span>
                        <span className="font-medium">₹{formatINR(diamondTotal)}</span>
                      </div>
                    )}
                    {platinumCart.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Platinum ({platinumCart.length})</span>
                        <span className="font-medium">₹{formatINR(platinumTotal)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t-2 border-yellow-300 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Grand Total</span>
                      <span className="text-2xl font-bold text-yellow-700">
                        ₹{formatINR(grandTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link
                      to="/checkout"
                      className="block w-full text-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md"
                    >
                      Proceed to Checkout
                    </Link>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to clear all items from your cart?")) {
                          clearCart("Gold");
                          clearCart("Silver");
                          clearCart("Diamond");
                          clearCart("Platinum");
                        }
                      }}
                      className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md"
                    >
                      Clear All
                    </button>
                    <Link
                      to="/"
                      className="block w-full text-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
