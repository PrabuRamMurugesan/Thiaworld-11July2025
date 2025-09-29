// ProductDetailPage.jsx — with Partial Payment checkbox + auto calculation
import React, { useEffect, useState, useContext, useMemo } from "react";
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
// import Header from "./Header"; // kept commented as in your file
import { Link } from "react-router-dom";

function apiOrigin() {
  const base = import.meta.env.VITE_API_URI || "";
  return base.replace(/\/api\/?$/, ""); // http://localhost:5000
}
function buildImgSrc(img) {
  if (!img) return "/default-product.jpeg";
  if (/^https?:\/\//i.test(img)) return img;
  if (img.startsWith("/uploads")) return `${apiOrigin()}${img}`;
  return "/default-product.jpeg";
}

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [usePartial, setUsePartial] = useState(false);
  const [advancePct, setAdvancePct] = useState(40); // default 40%

  useEffect(() => {
    fetchProduct();
    // reset UI for each product
    setUsePartial(false);
    setAdvancePct(40);
  }, [id]);
  // put this near your other state hooks
  const setAdvanceSafe = (val) => {
    const n = Number(val);
    const clamped = Math.min(90, Math.max(40, Number.isFinite(n) ? n : 40));
    setAdvancePct(clamped);
  };
useEffect(() => {
  fetchProduct();
  setUsePartial(false);
  setAdvanceSafe(40); // enforce floor on init
}, [id]);

  const fetchProduct = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URI}/products/${id}`
    );
    const prod = res.data;
    prod.category = prod.category || prod.metalType;
    setProduct(prod);
    const first = Array.isArray(prod.images) ? prod.images[0] : "";
    setSelectedImage(buildImgSrc(first));
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const payableBase = useMemo(() => {
    if (!product) return 0;
    // Prefer totalPayable if backend computed it; fallback to price
    const base = Number(product.totalPayable || product.price || 0);
    return Number.isFinite(base) ? base : 0;
  }, [product]);

  const advanceAmount = useMemo(() => {
    if (!usePartial) return 0;
    return Math.round((payableBase * Number(advancePct || 0)) / 100);
  }, [usePartial, advancePct, payableBase]);

  const remainingAmount = useMemo(() => {
    if (!usePartial) return payableBase;
    return Math.max(0, payableBase - advanceAmount);
  }, [usePartial, payableBase, advanceAmount]);

  const handleAddToCart = (directBuy = false) => {
    if (!product) return;
    // include partial info in the cart item, if enabled & checked
    const cartPayload = {
      ...product,
      _partial:
        product.isPartialPaymentEnabled && usePartial
          ? {
              enabled: true,
              advancePct: Number(advancePct),
              advanceAmount,
              remainingAmount,
            }
          : { enabled: false },
    };
    addToCart(cartPayload);
    alert("✅ Added to cart!");
    if (directBuy) navigate("/cart");
  };

  if (!product) return <p className="p-6">Loading...</p>;

  const strike =
    product.discount > 0
      ? Math.round(
          (product.price || 0) / (1 - Number(product.discount || 0) / 100)
        )
      : null;

  return (
    <>
      {/* <Header /> */}
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
              className="w-85 rounded shadow"
            />
            <div className="flex gap-2 mt-4">
              {Array.isArray(product.images) &&
                product.images.map((img, i) => {
                  const thumb = buildImgSrc(img);
                  return (
                    <img
                      key={i}
                      src={thumb}
                      alt={`thumb-${i}`}
                      className={`w-20 h-20 object-cover rounded border cursor-pointer ${
                        selectedImage === thumb
                          ? "border-yellow-500"
                          : "border-gray-300"
                      }`}
                      onClick={() => setSelectedImage(thumb)}
                    />
                  );
                })}
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-2">{product.description}</p>
            <Link
              to={`/write-testimonial/${product._id}`}
              className="btn btn-primary"
            >
              Write a Testimonial
            </Link>
            <div className="text-yellow-700 text-3xl font-bold mb-2">
              ₹{payableBase}
              {strike ? (
                <span className="text-gray-400 text-lg line-through ml-3">
                  ₹{strike}
                </span>
              ) : null}
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

            {/* NEW: Partial payment control */}
            {product.isPartialPaymentEnabled && (
              <div className="mt-2 mb-4 bg-yellow-50 border border-yellow-300 rounded p-3">
                <label className="flex items-center gap-2 font-semibold text-yellow-800">
                  <input
                    type="checkbox"
                    checked={usePartial}
                    onChange={(e) => setUsePartial(e.target.checked)}
                  />
                  Enable partial payment
                </label>

                {usePartial && (
                  <div className="mt-3 grid gap-2">
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-gray-700">Advance %</label>
                      <input
                        type="range"
                        min={10}
                        max={90}
                        step={5}
                        value={advancePct}
                        onChange={(e) => setAdvanceSafe(e.target.value)}
                        className="w-48"
                        aria-label="Advance percentage"
                      />
                      <input
                        type="number"
                        min={40}
                        max={90}
                        step={5}
                        value={advancePct}
                        onChange={(e) => {
                          const v = Math.max(
                            40,
                            Math.min(90, Number(e.target.value || 0))
                          );
                          setAdvancePct(v);
                        }}
                        className="w-16 border rounded px-2 py-1 text-sm"
                      />
                      <span className="text-sm text-gray-600">%</span>
                    </div>

                    <div className="text-sm text-gray-700 grid gap-1">
                      <div>
                        <strong>Advance Payment ({advancePct}%):</strong> ₹
                        {advanceAmount}
                      </div>
                      <div>
                        <strong>
                          Remaining on Delivery ({100 - Number(advancePct)}%):
                        </strong>{" "}
                        ₹{remainingAmount}
                      </div>
                    </div>
                  </div>
                )}
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
              Tags:{" "}
              {Array.isArray(product.tags)
                ? product.tags.join(", ")
                : "BIS, 22K, Hallmarked"}
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
