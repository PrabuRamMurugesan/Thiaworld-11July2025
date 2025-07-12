// ✅ FINAL ProductDetailPage.jsx — Full version with all corrections!

import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { HelmetProvider } from "react-helmet-async";
import {
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaPinterest,
  FaLink,
  FaEnvelope,
} from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import Footer from "./Footer";
import Header from "./Header";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const API = import.meta.env.VITE_API_BASE_URL;

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const res = await axios.get(`${API}/api/products/${id}`);
    const prod = res.data;
    prod.category = prod.category || prod.metalType;
    setProduct(prod);
    setSelectedImage(`${API}${prod.images[0]}`);
  };

  const shareUrl = window.location.href;

  const handleAddToCart = (directBuy = false) => {
    addToCart(product);
    alert(`✅ Added to cart!`);
    if (directBuy) navigate("/cart");
  };

  if (!product) return <p className="p-6">Loading...</p>;

  const partialPaymentAmount = product.isPartialPaymentEnabled
    ? Math.round(product.price * 0.4)
    : product.price;

  return (
    <>
      {/* <Header  /> */}
      <div className="p-6 max-w-7xl mx-auto">
        <HelmetProvider>
          <title>{product.name} | Thiaworld Jewellery</title>
          <meta name="description" content={product.description} />
          <link rel="canonical" href={shareUrl} />
        </HelmetProvider>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full rounded shadow"
            />
            <div className="flex gap-2 mt-4">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={`${API}${img}`}
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
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-2">{product.description}</p>

            <div className="text-yellow-700 text-3xl font-bold mb-2">
              ₹{product.price}
              {product.discount > 0 && (
                <span className="text-gray-400 text-lg line-through ml-3">
                  ₹{Math.round(product.price / (1 - product.discount / 100))}
                </span>
              )}
            </div>

            <div className="flex gap-2 mb-4">
              {product.isSecurePlanEnabled && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  Secure Plan Available
                </span>
              )}
              {product.isPartialPaymentEnabled && (
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                  Partial Payment
                </span>
              )}
              {product.isCombo && (
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                  Combo Product
                </span>
              )}
            </div>

            {product.isPartialPaymentEnabled && (
              <div className="mt-2 mb-4 text-sm text-gray-700 bg-yellow-50 border border-yellow-300 rounded p-3">
                <p className="font-semibold text-green-700 mb-1">
                  ✅ Partial Payment Available
                </p>
                <p>
                  <strong>Advance Payment (40%):</strong> ₹
                  {Math.round(product.price * 0.4)}
                </p>
                <p>
                  <strong>Remaining on Delivery (60%):</strong> ₹
                  {Math.round(product.price * 0.6)}
                </p>
              </div>
            )}

            <p className="text-sm text-gray-600 mb-1">
              Metal: {product.metalType} | Color: {product.metalColor} | Purity:{" "}
              {product.purity}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Net Weight: {product.netWeight}g | Gross Weight:{" "}
              {product.grossWeight}g
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Making Charges: ₹{product.makingCharges} | GST: {product.gst}%
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Category: {product.category}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Stock: {product.stockStatus || "Available"}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Size: {product.size || "2mm x 1mm x 0.5mm"}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Tax: {product.taxType || "taxable (standard)"}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Tags: {product.tags?.join(", ") || "BIS, 22K, Hallmarked"}
            </p>

            <p className="text-sm text-blue-600 mt-2">
              Note: Thank you for shopping with Thiaworld!
            </p>

            {/* Share */}
            <div className="flex items-center gap-4 mt-4">
              <FaWhatsapp className="cursor-pointer" />
              <FaFacebookF className="cursor-pointer" />
              <FaTwitter className="cursor-pointer" />
              <FaPinterest className="cursor-pointer" />
              <FaLink
                className="cursor-pointer"
                onClick={() => navigator.clipboard.writeText(shareUrl)}
              />
              <FaEnvelope className="cursor-pointer" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-4">
              <button
                className="bg-yellow-500 px-5 py-2 text-white rounded hover:bg-yellow-600"
                onClick={() => handleAddToCart(false)}
              >
                Add to Cart
              </button>
              <button
                className="bg-orange-500 px-5 py-2 text-white rounded hover:bg-orange-600"
                onClick={() => handleAddToCart(true)}
              >
                Buy Now
              </button>
            </div>

            {/* Video Call & WhatsApp Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-yellow-50 border border-yellow-300 p-4 rounded">
                <h4 className="font-semibold mb-2">📹 Video Call Us</h4>
                <p className="text-sm mb-2">
                  Speak with our expert jeweller directly and examine the piece
                  in real-time over a video call.
                </p>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded">
                  Video call
                </button>
              </div>
              <div className="bg-green-50 border border-green-300 p-4 rounded">
                <h4 className="font-semibold mb-2">💬 Whatsapp</h4>
                <p className="text-sm mb-2">
                  Have questions? Chat with our support team anytime on
                  WhatsApp.
                </p>
                <button className="bg-green-600 text-white px-4 py-2 rounded">
                  Chat with Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailPage;
