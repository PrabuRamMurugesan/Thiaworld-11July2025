// ✅ FINAL CheckoutPage.jsx with Diamond & Platinum support

import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import { pickFirstImageSrc, normalizeImages, buildImgSrc } from "../utils/imageTools";

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

const CheckoutPage = () => {
  const { goldCart, silverCart, diamondCart, platinumCart, clearCart } =
    useContext(CartContext); 
  const [form, setForm] = useState({
    shipping: {
      name: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
    billing: {
      name: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
    sameAsShipping: false,
  });

  const [paymentType, setPaymentType] = useState("full");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ✅ Totals
  const goldTotal = goldCart.reduce((sum, item) => sum + Number(item.price || item.finalPrice || item.breakdown?.salesPrice || 0), 0);
  const silverTotal = silverCart.reduce((sum, item) => sum + Number(item.price || item.finalPrice || item.breakdown?.salesPrice || 0), 0);
  const diamondTotal = diamondCart.reduce((sum, item) => sum + Number(item.price || item.finalPrice || item.breakdown?.salesPrice || 0), 0);
  const platinumTotal = platinumCart.reduce((sum, item) => sum + Number(item.price || item.finalPrice || item.breakdown?.salesPrice || 0), 0);

  const totalProductPrice =
    goldTotal + silverTotal + diamondTotal + platinumTotal;
  const totalGST = totalProductPrice * 0.03;
  const fullTotal = totalProductPrice + totalGST;
  const partialTotal = totalProductPrice * 0.4 + totalGST;

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [name]: value },
    }));
  };

  const handleCheckbox = (e) => {
    setForm((prev) => ({
      ...prev,
      sameAsShipping: e.target.checked,
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // ✅ Save order in backend
      const saveRes = await axios.post(
        `${import.meta.env.VITE_API_URI}/checkout/submit`,
        {
          shipping: form.shipping,
          billing: form.sameAsShipping ? form.shipping : form.billing,
          goldCart,
          silverCart,
          diamondCart,
          platinumCart,
          totalProductPrice,
          totalGST,
          grandTotal: paymentType === "full" ? fullTotal : partialTotal,
          paymentType,
        }
      );
      console.log("✅ Order saved:", saveRes.data);

      // ✅ Create Razorpay order
      const createOrderRes = await axios.post(
        `${import.meta.env.VITE_API_URI}/razorpay/create-order`,
        {
          amount: paymentType === "full" ? fullTotal : partialTotal,
        }
      );
      const { order } = createOrderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Thiaworld Jewellery",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          await axios.post(
            `${import.meta.env.VITE_API_URI}/checkout/update-payment-status`,
            {
              razorpay_order_id: order.id,
              razorpay_payment_id: response.razorpay_payment_id,
              status: "paid",
            }
          );
          alert("✅ Payment Successful!");
          clearCart("Gold");
          clearCart("Silver");
          clearCart("Diamond");
          clearCart("Platinum");
          setSuccess("Order placed and payment successful!");
        },
        prefill: {
          name: form.shipping.name,
          email: form.shipping.email,
          contact: form.shipping.phone,
        },
        theme: {
          color: "#F37254",
        },
      };

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load.");
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setError("Something went wrong during payment.");
    } finally {
      setSaving(false);
    }
  };

  // Render product card component
  const renderProductCard = (item) => {
    const images = normalizeImages(item.images || []);
    const firstImage = pickFirstImageSrc(images);
    const productImage = buildImgSrc(firstImage);
    const itemPrice = Number(item.price || item.finalPrice || item.breakdown?.salesPrice || 0);

    return (
      <div
        key={item._id}
        className="bg-white rounded-lg shadow-sm p-4 mb-3 border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div className="flex gap-4">
          <Link to={`/product/${item._id}`}>
            <img
              src={productImage}
              alt={item.name || "Product"}
              className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
              onError={(e) => {
                e.currentTarget.src = "/default-product.jpg";
              }}
            />
          </Link>
          <div className="flex-grow">
            <Link to={`/product/${item._id}`}>
              <h4 className="text-base font-semibold text-gray-800 hover:text-yellow-600 transition-colors mb-1">
                {item.name || "Product Name"}
              </h4>
            </Link>
            {item.purity && (
              <p className="text-sm text-gray-600 mb-1">Purity: {item.purity}</p>
            )}
            <p className="text-lg font-bold text-yellow-700 mt-2">
              ₹{formatINR(itemPrice)}
            </p>
          </div>
        </div>
      </div>
    );
  };

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
          Checkout
        </h2>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address Forms */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* ✅ SHIPPING & BILLING */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Shipping Address */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 pb-2 border-b-2 border-yellow-500">
                    Shipping Address
                  </h3>
                  {["name", "address", "city", "postalCode", "country"].map((field) => (
                    <div key={field} className="mb-4">
                      <label className="block mb-2 text-sm font-medium text-gray-700 capitalize">
                        {field === "postalCode" ? "Postal Code" : field}
                      </label>
                      <input
                        type="text"
                        name={field}
                        value={form.shipping[field]}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        required
                        className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder={`Enter ${field === "postalCode" ? "postal code" : field}`}
                      />
                    </div>
                  ))}
                </div>

                {/* Billing Address */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-yellow-500">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Billing Address
                    </h3>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.sameAsShipping}
                        onChange={handleCheckbox}
                        className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Same as Shipping</span>
                    </label>
                  </div>
                 
                  {!form.sameAsShipping && (
                    <>
                      {["name", "address", "city", "postalCode", "country"].map(
                        (field) => (
                          <div key={field} className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700 capitalize">
                              {field === "postalCode" ? "Postal Code" : field}
                            </label>
                            <input
                              type="text"
                              name={field}
                              value={form.billing[field]}
                              onChange={(e) => handleInputChange(e, "billing")}
                              required
                              className="w-full border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-500 transition-colors"
                              placeholder={`Enter ${field === "postalCode" ? "postal code" : field}`}
                            />
                          </div>
                        )
                      )}
                    </>
                  )}
                  {form.sameAsShipping && (
                    <p className="text-gray-500 text-sm italic mt-2">
                      Billing address will be same as shipping address
                    </p>
                  )}
                </div>
              </div>
            </form>

            {/* ✅ CART ITEMS */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 pb-2 border-b-2 border-yellow-500">
                Order Items
              </h3>

              {/* Gold Items */}
              {goldCart.length > 0 && (
                <div className="mb-6">
                  <h4
                    className="text-lg font-semibold mb-3 pb-1 border-b"
                    style={{ color: "rgb(207, 162, 47)" }}
                  >
                    Gold Products ({goldCart.length})
                  </h4>
                  {goldCart.map((item) => renderProductCard(item))}
                </div>
              )}

              {/* Silver Items */}
              {silverCart.length > 0 && (
                <div className="mb-6">
                  <h4
                    className="text-lg font-semibold mb-3 pb-1 border-b"
                    style={{ color: "rgb(135, 135, 135)" }}
                  >
                    Silver Products ({silverCart.length})
                  </h4>
                  {silverCart.map((item) => renderProductCard(item))}
                </div>
              )}

              {/* Diamond Items */}
              {diamondCart.length > 0 && (
                <div className="mb-6">
                  <h4
                    className="text-lg font-semibold mb-3 pb-1 border-b"
                    style={{ color: "rgb(177, 179, 181)" }}
                  >
                    Diamond Products ({diamondCart.length})
                  </h4>
                  {diamondCart.map((item) => renderProductCard(item))}
                </div>
              )}

              {/* Platinum Items */}
              {platinumCart.length > 0 && (
                <div className="mb-6">
                  <h4
                    className="text-lg font-semibold mb-3 pb-1 border-b"
                    style={{ color: "rgb(153, 153, 153)" }}
                  >
                    Platinum Products ({platinumCart.length})
                  </h4>
                  {platinumCart.map((item) => renderProductCard(item))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-lg p-6 sticky top-4 border-2 border-yellow-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800 pb-2 border-b-2 border-yellow-400">
                Order Summary
              </h3>
              
              {/* Payment Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentType"
                      value="full"
                      checked={paymentType === "full"}
                      onChange={(e) => setPaymentType(e.target.value)}
                      className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Full Payment</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentType"
                      value="partial"
                      checked={paymentType === "partial"}
                      onChange={(e) => setPaymentType(e.target.value)}
                      className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Partial Payment (40%)</span>
                  </label>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-4">
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

              <div className="border-t-2 border-yellow-300 pt-4 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Product Total</span>
                  <span className="font-medium">₹{formatINR(totalProductPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (3%)</span>
                  <span className="font-medium">₹{formatINR(totalGST)}</span>
                </div>
              </div>

              <div className="border-t-2 border-yellow-400 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Grand Total</span>
                  <span className="text-2xl font-bold text-yellow-700">
                    ₹{formatINR(paymentType === "full" ? fullTotal : partialTotal)}
                  </span>
                </div>
                {paymentType === "partial" && (
                  <p className="text-xs text-gray-500 mt-1">
                    (40% advance: ₹{formatINR(totalProductPrice * 0.4)} + GST)
                  </p>
                )}
              </div>

              {/* Place Order Button */}
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {saving ? "Placing Order..." : "Place Order"}
              </button>

              <Link
                to="/cart"
                className="block w-full text-center mt-3 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
              >
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
