// ✅ FINAL CheckoutPage.jsx with Diamond & Platinum support

import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import axios from "axios";

const CheckoutPage = () => {
  const { goldCart, silverCart, diamondCart, platinumCart, clearCart } =
    useContext(CartContext);
const [selectedImage, setSelectedImage] = useState(""); 
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
  const goldTotal = goldCart.reduce((sum, item) => sum + item.price, 0);
  const silverTotal = silverCart.reduce((sum, item) => sum + item.price, 0);
  const diamondTotal = diamondCart.reduce((sum, item) => sum + item.price, 0);
  const platinumTotal = platinumCart.reduce((sum, item) => sum + item.price, 0);

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
        "http://localhost:5000/api/checkout/submit",
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
        "http://localhost:5000/api/razorpay/create-order",
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
            "http://localhost:5000/api/checkout/update-payment-status",
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

  return (
    <>
    <div className="container mx-auto my-8  p-5 border" >
      <h2 className="font-bold mb-6 text-center " 
      style={{
            color: "rgb(32, 32, 32)",
            borderBottom: "2px solid rgb(32, 32, 32)",
            paddingBottom: "10px",
            fontSize: "35px",
            fontFamily:"'Playfair Display', serif"
          }}
      >Checkout</h2>

      {success && <p className="text-green-600 mb-2">{success}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* ✅ SHIPPING & BILLING */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
      >
        {/* Shipping */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
          {["name", "address", "city", "postalCode", "country"].map((field) => (
            <div key={field} className="mb-0 p-1">
              <label className="block mb-1 capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={form.shipping[field]}
                onChange={(e) => handleInputChange(e, "shipping")}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          ))}
        </div>

        {/* Billing */}
        <div>
          <h3 className="text-lg font-semibold  d-flex justify-between">Billing Address 
            <label className="inline-flex items-center mb-3">
            <input
              type="checkbox"
              checked={form.sameAsShipping}
              onChange={handleCheckbox}
              className="mr-2"
            />
            Same as Shipping
          </label></h3>
         
          {!form.sameAsShipping && (
            <>
              {["name", "address", "city", "postalCode", "country"].map(
                (field) => (
                  <div key={field} className="mb-2">
                    <label className="block mb-1 capitalize">{field}</label>
                    <input
                      type="text"
                      name={field}
                      value={form.billing[field]}
                      onChange={(e) => handleInputChange(e, "billing")}
                      required
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                )
              )}
            </>
          )}
        </div>
      </form>

      {/* ✅ CART ITEMS */}
      <div className="my-8">
        <h3 className="font-semibold mb-2 text-yellow-600">Gold Items</h3>
        {goldCart.length === 0 ? (
          <p>No Gold Items</p>
        ) : (
          goldCart.map((item) => (
            <div key={item._id} className="flex items-center gap-4 mb-2">
                 {/* Product image and name */}
                  <div className="flex gap-2 mt-4">
                    {item.images &&
                      item.images.map((img, i) => (
                        <img
                          key={i}
                          src={`http://localhost:5000${img}`}
                          alt={`thumb-${i}`}
                          className={`w-20 h-20 object-cover rounded border cursor-pointer ${
                            selectedImage === img
                              ? "border-yellow-500"
                              : "border-gray-300"
                          }`}
                          onClick={() => setSelectedImage(img)}
                        />
                      ))}
                  </div>
              <div>
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>
              </div>
            </div>
          ))
        )}

        <h3 className="font-semibold mb-2mt-4" style={{color:'rgb(135, 135, 135)'}}>Silver Items</h3>
        {silverCart.length === 0 ? (
          <p>No Silver Items</p>
        ) : (
          silverCart.map((item) => (
            <div key={item._id} className="flex items-center gap-4 mb-2">
                   {/* Product image and name */}
                  <div className="flex gap-2 mt-4">
                    {item.images &&
                      item.images.map((img, i) => (
                        <img
                          key={i}
                          src={`http://localhost:5000${img}`}
                          alt={`thumb-${i}`}
                          className={`w-20 h-20 object-cover rounded border cursor-pointer ${
                            selectedImage === img
                              ? "border-yellow-500"
                              : "border-gray-300"
                          }`}
                          onClick={() => setSelectedImage(img)}
                        />
                      ))}
                  </div>
              <div>
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>
              </div>
            </div>
          ))
        )}

        <h3 className="font-semibold mb-2 mt-4" style={{color:'rgb(177, 179, 181)'}}>
          Diamond Items
        </h3>
        {diamondCart.length === 0 ? (
          <p>No Diamond Items</p>
        ) : (
          diamondCart.map((item) => (
            <div key={item._id} className="flex items-center gap-4 mb-2">
                   {/* Product image and name */}
                  <div className="flex gap-2 mt-4">
                    {item.images &&
                      item.images.map((img, i) => (
                        <img
                          key={i}
                          src={`http://localhost:5000${img}`}
                          alt={`thumb-${i}`}
                          className={`w-20 h-20 object-cover rounded border cursor-pointer ${
                            selectedImage === img
                              ? "border-yellow-500"
                              : "border-gray-300"
                          }`}
                          onClick={() => setSelectedImage(img)}
                        />
                      ))}
                  </div>
              <div>
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>
              </div>
            </div>
          ))
        )}

        <h3 className="font-semibold mb-2 mt-4" style={{color:'rgb(153, 153, 153)'}}>
          Platinum Items
        </h3>
        {platinumCart.length === 0 ? (
          <p>No Platinum Items</p>
        ) : (
          platinumCart.map((item) => (
            <div key={item._id} className="flex items-center gap-4 mb-2">
            {/* Product image and name */}
                  <div className="flex gap-2 mt-4">
                    {item.images &&
                      item.images.map((img, i) => (
                        <img
                          key={i}
                          src={`http://localhost:5000${img}`}
                          alt={`thumb-${i}`}
                          className={`w-20 h-20 object-cover rounded border cursor-pointer ${
                            selectedImage === img
                              ? "border-yellow-500"
                              : "border-gray-300"
                          }`}
                          onClick={() => setSelectedImage(img)}
                        />
                      ))}
                  </div>
              <div>
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ TOTALS */}
      <div className="my-6">
        <p>Gold: ₹{goldTotal}</p>
        <p>Silver: ₹{silverTotal}</p>
        <p>Diamond: ₹{diamondTotal}</p>
        <p>Platinum: ₹{platinumTotal}</p>
        <p className="font-semibold">Product Total: ₹{totalProductPrice}</p>
        <p className="font-semibold">GST: ₹{totalGST.toFixed(2)}</p>
        <p className="font-bold">
          Grand Total: ₹
          {paymentType === "full"
            ? fullTotal.toFixed(2)
            : partialTotal.toFixed(2)}
        </p>

        <div className="my-4">
          <label className="mr-4">
            <input
              type="radio"
              checked={paymentType === "full"}
              onChange={() => setPaymentType("full")}
            />{" "}
            Full Payment
          </label>
          <label>
            <input
              type="radio"
              checked={paymentType === "partial"}
              onChange={() => setPaymentType("partial")}
            />{" "}
            Partial Payment
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-3 bg-green-600 text-white rounded"
        >
          {saving ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
    </>
  );
};

export default CheckoutPage;
