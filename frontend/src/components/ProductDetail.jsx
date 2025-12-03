// ProductDetailPage.jsx
import React, { useEffect, useState, useContext, useMemo, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
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
import {
  buildImgSrc,
  normalizeImages,
  pickFirstImageSrc,
} from "../utils/imageTools";

function apiOrigin() {
  const base =
    import.meta.env.VITE_API_URI || import.meta.env.VITE_API_URL || "";
  return base.replace(/\/api\/?$/, "");
}


const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("/default-product.jpg");
  const [usePartial, setUsePartial] = useState(false);
  const [advancePct, setAdvancePct] = useState(40);
  const mainImageSize = 500;
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [galleryList, setGalleryList] = useState([]);

  // Lens Zoom States
  const [lensPos, setLensPos] = useState({ x: 10, y: 0 });
  const [showLens, setShowLens] = useState(false);
  const imgRef = useRef(null);
  const lensSize = 150;
  const zoom = 2;
  function formatINR(n) {
    return Number(n || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function buildImgSrc(img) {
    if (!img) return "/default-product.jpg";
    if (/^https?:\/\//i.test(img)) return img;
    if (img.startsWith("/uploads/")) return `${apiOrigin()}${img}`;
    return `${apiOrigin()}/uploads/${img}`;
  }
  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URI}/products/${id}`
      );
      const prod = res.data;
      prod.category = prod.category || prod.metalType;
      setProduct(prod);

      const normalizedGallery = normalizeImages(prod?.images);
      setGalleryList(normalizedGallery);

      if (normalizedGallery.length > 0) {
        setSelectedImage(buildImgSrc(normalizedGallery[0]));
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
    }
  };
  useEffect(() => {
    fetchProduct();
    setUsePartial(false);
    setAdvancePct(40);
  }, [id]);

  const setAdvanceSafe = (val) => {
    const n = Number(val);
    const clamped = Math.min(90, Math.max(40, Number.isFinite(n) ? n : 40));
    setAdvancePct(clamped);
  };

  // new
  const payableBase = useMemo(() => {
    if (!product) return 0;

    // Prefer dynamic gold-based sale price if available
    const base = Number(
      product.finalPrice || product.totalPayable || 0
    );

    return Number.isFinite(base) ? base : 0;
  }, [product]);

  const advanceAmount = useMemo(
    () => (usePartial ? Math.round((payableBase * advancePct) / 100) : 0),
    [usePartial, advancePct, payableBase]
  );
  const remainingAmount = useMemo(
    () => (usePartial ? Math.max(0, payableBase - advanceAmount) : payableBase),
    [usePartial, payableBase, advanceAmount]
  );

  const handleAddToCart = (directBuy = false) => {
    if (!product) return;
    const cartPayload = {
      ...product,
      _partial:
        product.isPartialPaymentEnabled && usePartial
          ? { enabled: true, advancePct, advanceAmount, remainingAmount }
          : { enabled: false },
    };
    addToCart(cartPayload);

    // ✅ Show in-page alert
    setAlertMessage("✅ Product added to cart!");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);

    if (directBuy) navigate("/cart");
  };

  const handleMouseMove = (e) => {
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensX = Math.max(
      lensSize / 2,
      Math.min(x, rect.width - lensSize / 2)
    );
    const lensY = Math.max(
      lensSize / 2,
      Math.min(y, rect.height - lensSize / 2)
    );
    setLensPos({ x: lensX, y: lensY });
  };

  if (!product)
    return (
      <p className="text-center flex items-center justify-center">
        <ClipLoader color="goldring" size={60} />
      </p>
    );

  // Use backend-computed actual price when available
  const displayActual = Number(product.displayActual || product.price || 0);

  // Only show strike if it is actually higher than sale price
  const strike = displayActual > payableBase ? displayActual : null;
  const altText = product.name || "Product Image";
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  return (
    <>
      <Header />

      {/* Floating Centered Gold Alert */}
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div
            className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-gray-900 font-semibold px-4 pb-2
    rounded-2xl shadow-2xl border-2 border-yellow-600 pointer-events-auto animate-fadeInOut text-center max-w-xs"
          >
            <span className="text-2xl"></span> {alertMessage}{" "}
            <span className="text-2xl"></span>
          </div>
        </div>
      )}

      <div className="p-6 max-w-7xl mx-auto">
        <HelmetProvider>
          <title>{product.name} | Thiaworld Jewellery</title>
          <meta name="description" content={product.description} />
          <link rel="canonical" href={shareUrl} />
        </HelmetProvider>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Zoom Image */}
          <div className="flex justify-center gap-2">
            <div
              className={`relative w-[${mainImageSize}px] h-[${mainImageSize}px] overflow-hidden cursor-zoom-in`}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setShowLens(true)}
              onMouseLeave={() => setShowLens(false)}
            >
              <img
                ref={imgRef}
                src={selectedImage}
                alt={altText}
                className="w-full h-full object-cover rounded shadow"
              />

              {showLens && (
                <div
                  style={{
                    width: `${lensSize}px`,
                    height: `${lensSize}px`,
                    position: "absolute",
                    left: `${lensPos.x - lensSize / 2}px`,
                    top: `${lensPos.y - lensSize / 2}px`,
                    border: "2px solid rgba(255,200,0,0.8)",
                    backgroundImage: `url(${selectedImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: `${mainImageSize * zoom}px ${
                      mainImageSize * zoom
                    }px`,
                    backgroundPosition: `-${
                      lensPos.x * zoom - lensSize / 2
                    }px -${lensPos.y * zoom - lensSize / 2}px`,
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 mt-4 flex-wrap justify-center">
              {galleryList.map((img) => (
                <img
                  key={img}
                  src={buildImgSrc(img)}
                  alt=""
                  onClick={() => setSelectedImage(buildImgSrc(img))}
                  style={{
                    width: 70,
                    height: 70,
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-2">{product.description}</p>

            <div className="text-yellow-700 text-3xl font-bold mb-2">
              <h2 className="text-3xl font-bold text-yellow-700 mr-3">
                ₹{formatINR(payableBase)}
              </h2>

              {strike && (
                <span className="text-gray-400 line-through text-lg">
                  ₹{formatINR(strike)}
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

            {/* Partial Payment */}
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
                      />
                      <input
                        type="number"
                        min={40}
                        max={90}
                        step={5}
                        value={advancePct}
                        onChange={(e) => setAdvanceSafe(e.target.value)}
                        className="w-16 border rounded px-2 py-1 text-sm"
                      />
                      <span className="text-sm text-gray-600">%</span>
                    </div>
                    <div className="text-sm text-gray-700 grid gap-1">
                      <div>
                        <strong>Advance Payment ({advancePct}%):</strong> ₹
                        {formatINR(advanceAmount)}
                      </div>
                      <div>
                        <strong>
                          Remaining on Delivery ({100 - advancePct}%):
                        </strong>{" "}
                        ₹{formatINR(remainingAmount)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Other Info */}
            <p className="text-sm text-gray-600 mb-1">
              Metal: {product.metalType} | Color: {product.metalColor} | Purity:{" "}
              {product.purity}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Net Weight: {product.netWeight}g | Gross Weight:{" "}
              {product.grossWeight}g
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Making Charges: ₹{formatINR(product.makingCharges)} | GST:{" "}
              {product.gst}%
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
            <Link
              to={`/write-testimonial/${product._id}`}
              className="btn btn-primary  gap-4 mt-4 bg-orange-500"
            >
              Write a Testimonial
            </Link>
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
