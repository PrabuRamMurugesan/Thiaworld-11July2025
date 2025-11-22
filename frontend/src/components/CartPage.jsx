// ✅ src/pages/CartPage.jsx
import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

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

  const goldTotal = goldCart.reduce((sum, item) => sum + item.price, 0);
  const silverTotal = silverCart.reduce((sum, item) => sum + item.price, 0);
  const diamondTotal = diamondCart.reduce((sum, item) => sum + item.price, 0);
  const platinumTotal = platinumCart.reduce((sum, item) => sum + item.price, 0);
  const grandTotal = goldTotal + silverTotal + diamondTotal + platinumTotal;

  return (
    <>
    <Header/>
      <div className="container mx-auto my-8 p-5 border h-100 ">
        <h2
          className=" font-bold mb-6 text-center "
          style={{
            color: "rgb(32, 32, 32)",
            borderBottom: "2px solid rgb(207, 162, 47)",
            paddingBottom: "10px",
            fontSize: "35px",
           fontFamily:"'Playfair Display', serif"
          }}
        >
          My Cart
        </h2>

        {/* ✅ GOLD PRODUCTS */}
        <div className="mb-8">
          <h3
            className="text-xl font-semibold  mb-3"
            style={{ color: "rgb(207, 162, 47)" }}
          >
            Gold Products
          </h3>
          {goldCart.length === 0 ? (
            <p className="text-gray-600">No Gold items in cart.</p>
          ) : (
            <ul className="space-y-2">
              {goldCart.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-center border-b pb-2"
                >
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

                  <span>
                    {item.name} — ₹{item.price} — {item.image}
                  </span>
                  <button
                    onClick={() => removeFromCart(item._id, "Gold")}
                    className="text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 font-semibold">Gold Subtotal: ₹{goldTotal}</p>
        </div>

        {/* ✅ SILVER PRODUCTS */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3" style={{color:'rgb(135, 135, 135)'}}>
            Silver Products
          </h3>
          {silverCart.length === 0 ? (
            <p className="text-gray-600">No Silver items in cart.</p>
          ) : (
            <ul className="space-y-2">
              {silverCart.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-center border-b pb-2"
                >
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
                  <span>
                    {item.name} — ₹{item.price}
                  </span>
                  <button
                    onClick={() => removeFromCart(item._id, "Silver")}
                    className="text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 font-semibold">Silver Subtotal: ₹{silverTotal}</p>
        </div>
        {/* ✅ DIAMOND PRODUCTS */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold  mb-3" style={{color:'rgb(177, 179, 181)'}}>
            Diamond Products
          </h3>
          {diamondCart.length === 0 ? (
            <p className="text-gray-600">No Diamond items in cart.</p>
          ) : (
            <ul className="space-y-2">
              {diamondCart.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-center border-b pb-2"
                >
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
                  <span>
                    {item.name} — ₹{item.price}
                  </span>
                  <button
                    onClick={() => removeFromCart(item._id, "Diamond")}
                    className="text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 font-semibold">
            Diamond Subtotal: ₹{diamondTotal}
          </p>
        </div>

        {/* ✅ PLATINUM PRODUCTS */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold  mb-3" style={{color:'rgb(153, 153, 153)'}}>
            Platinum Products
          </h3>
          {platinumCart.length === 0 ? (
            <p className="text-gray-600">No Platinum items in cart.</p>
          ) : (
            <ul className="space-y-2">
              {platinumCart.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-center border-b pb-2"
                >
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
                  <span>
                    {item.name} — ₹{item.price}
                  </span>
                  <button
                    onClick={() => removeFromCart(item._id, "Platinum")}
                    className="text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 font-semibold">
            Platinum Subtotal: ₹{platinumTotal}
          </p>
        </div>

        {/* ✅ GRAND TOTAL */}
        <h4 className="text-lg font-bold mb-4">Grand Total: ₹{grandTotal}</h4>

        <div className="flex gap-4">
          <Link
            to="/checkout"
            className="btn btn-success px-4 py-2 rounded-pill shadow" type="button"
          >
            Proceed to Checkout
          </Link>
          <button
            onClick={() => {
              clearCart("Gold");
              clearCart("Silver");
              clearCart("Diamond")
              clearCart("Platinum")
            }}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Clear All
          </button>
        </div>
      </div>
     <Footer/>
    </>
  );
};

export default CartPage;
