// ProductDetailPage.jsx
import React, { useEffect, useState, useContext, useMemo, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { HelmetProvider } from "react-helmet-async";
import { IoIosShareAlt } from "react-icons/io";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import {
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaPinterest,
  FaLink,
  FaEnvelope,
} from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import { normalizeImages } from "../utils/imageTools";
import ProductBottom from "./ProductBottom";
import { FiStar } from "react-icons/fi";
import { GoStarFill } from "react-icons/go";
import { TbTruckDelivery } from "react-icons/tb";
function apiOrigin() {
  const base =
    import.meta.env.VITE_API_URI || import.meta.env.VITE_API_URL || "";
  return base.replace(/\/api\/?$/, "");
}

// Money format
function formatINR(n) {
  return Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Image
function buildImgSrc(img) {
  if (!img) return "/default-product.jpg";
  if (/^https?:\/\//i.test(img)) return img;
  if (img.startsWith("/uploads/")) return `${apiOrigin()}${img}`;
  return `${apiOrigin()}/uploads/${img}`;
}

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [active, setActive] = useState(false);
  const [product, setProduct] = useState(null);
  const [galleryList, setGalleryList] = useState([]);
  const [selectedImage, setSelectedImage] = useState("/default-product.jpg");
  const [liked, setLiked] = useState(false);

  const [usePartial, setUsePartial] = useState(false);
  const [advancePct, setAdvancePct] = useState(40);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Zoom
  const imgRef = useRef(null);
  const [lensPos, setLensPos] = useState({ x: 10, y: 0 });
  const [showLens, setShowLens] = useState(false);
  const lensSize = 150;
  const zoom = 2;
  const mainImageSize = 500;

  // Fetch product
  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URI}/products/${id}`
      );
      const prod = res.data;
      prod.category = prod.category || prod.metalType;
      setProduct(prod);

      const imgs = normalizeImages(prod?.images || []);
      setGalleryList(imgs);
      if (imgs.length > 0) setSelectedImage(buildImgSrc(imgs[0]));
    } catch (err) {
      console.error("Failed to fetch product:", err);
    }
  };

  useEffect(() => {
    fetchProduct();
    setUsePartial(false);
    setAdvancePct(40);
  }, [id]);

  // Safe slider value
  const setAdvanceSafe = (val) => {
    const n = Number(val);
    setAdvancePct(Math.min(90, Math.max(40, Number.isFinite(n) ? n : 40)));
  };

  // ================================
  // SALE PRICE (Final Price AFTER discount + GST)
  // This should match the Grand Total Final Value from Price Breakup
  // ================================
  const payableBase = useMemo(() => {
    if (!product) return 0;
    
    // If breakdown exists, calculate final price from breakdown
    if (product.breakdown) {
      const breakdown = product.breakdown;
      const actualPrice = breakdown.actualPrice || 
        (breakdown.goldValue || 0) + 
        (breakdown.makingValue || 0) + 
        (breakdown.wastageValue || 0) + 
        (breakdown.stoneValue || 0);
      
      const discountAmount = breakdown.discount || 0;
      const priceAfterDiscount = actualPrice - discountAmount;
      const gstPercent = Number(product.gst || 0);
      // Match PriceBreakup calculation exactly (with rounding)
      const gstOnAfterDiscount = Math.round((priceAfterDiscount * gstPercent) / 100);
      const finalPrice = priceAfterDiscount + gstOnAfterDiscount;
      
      return finalPrice;
    }
    
    // Fallback to product price fields if no breakdown
    return Number(
      product.finalPrice || product.totalPayable || product.price || 0
    );
  }, [product]);

  // ================================
  // STRIKE PRICE (Price BEFORE discount)
  // This should be the actualPrice from breakdown (price without discount)
  // ================================
  const strike = useMemo(() => {
    if (!product || !product.breakdown) return null;

    // Use actualPrice (price before discount) as strike-through price
    const actualPrice = product.breakdown.actualPrice || product.breakdown.goldValue + 
      (product.breakdown.makingValue || 0) + 
      (product.breakdown.wastageValue || 0) + 
      (product.breakdown.stoneValue || 0);
    
    return actualPrice;
  }, [product]);

  // ================================
  // PARTIAL PAYMENT
  // ================================

  const advanceAmount = useMemo(
    () => (usePartial ? Math.round((payableBase * advancePct) / 100) : 0),
    [usePartial, advancePct, payableBase]
  );

  const remainingAmount = useMemo(
    () => (usePartial ? Math.max(0, payableBase - advanceAmount) : payableBase),
    [usePartial, payableBase, advanceAmount]
  );

  // Cart
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

    setAlertMessage("Product added to cart!");
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);

    if (directBuy) navigate("/cart");
  };

  // Zoom move
  const handleMouseMove = (e) => {
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lx = Math.max(lensSize / 2, Math.min(x, rect.width - lensSize / 2));
    const ly = Math.max(lensSize / 2, Math.min(y, rect.height - lensSize / 2));

    setLensPos({ x: lx, y: ly });
  };

  if (!product)
    return (
      <p className="text-center flex items-center justify-center">
        <ClipLoader color="goldring" size={60} />
      </p>
    );

  const altText = product.name || "Product Image";
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  // ================================
  // RENDER
  // ================================

  return (
    <>
      <Header />

      {/* Alert */}
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div
            className="bg-yellow-300 text-gray-900 font-semibold px-4 pb-2
            rounded-2xl shadow-2xl border-2 border-yellow-600 pointer-events-auto text-center max-w-xs"
          >
            {alertMessage}
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
          {/* Image */}
          <div className="flex flex-col items-center">
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

          {/* Info */}
          <div>
            <div className="d-flex align-center justify-between my-3 action-bar">
              {/* Bestseller */}
              <span
                onClick={() => setActive(!active)}
                title="BestSeller"
                className="action-item"
              >
                {active ? <GoStarFill color="red" /> : <FiStar />}
              </span>

              <span className="divider" />

              {/* Delivery */}
              <span title="Fast Delivery" className="action-item">
                <TbTruckDelivery />
              </span>

              <span className="divider" />

              {/* Share */}
              <span title="Share" className="action-item text">
                <IoIosShareAlt size={20} />
                <span>Share</span>
              </span>

              <span className="divider" />

              {/* Wishlist */}
              <span
                title="Wishlist"
                onClick={() => setLiked(!liked)}
                className="action-item text"
              >
                {liked ? (
                  <AiFillHeart color="red" size={20} />
                ) : (
                  <AiOutlineHeart size={20} />
                )}
                <span>Wishlist</span>
              </span>

              <span className="divider" />

              {/* View Similar */}
              <span className="view-similar">View Similar</span>
            </div>

            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-2">{product.description}</p>

            {/* PRICE BLOCK */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-3xl font-bold text-yellow-700">
                ₹{formatINR(payableBase)}
              </h2>

              {strike && (
                <span className="text-gray-500 line-through text-lg">
                  ₹{formatINR(strike)}
                </span>
              )}
            </div>

            {/* Tags */}
            <div className="flex gap-2 mb-4">
              {product.isSecurePlanEnabled && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  Secure Plan
                </span>
              )}
              {product.isPartialPaymentEnabled && (
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                  Partial Payment
                </span>
              )}
              {product.isCombo && (
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                  Combo
                </span>
              )}
            </div>

            {/* Partial */}
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
                  <div className="mt-3 grid gap-1 text-sm text-gray-700">
                    <div>
                      <strong>Advance ({advancePct}%):</strong> ₹
                      {formatINR(advanceAmount)}
                    </div>
                    <div>
                      <strong>Remaining:</strong> ₹{formatINR(remainingAmount)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Specs */}
            <p className="text-sm text-gray-600 mb-1">
              Metal: {product.metalType} | Purity: {product.purity}
            </p>

            {/* 22K Gold Rate Display */}
            {product.metalType?.toLowerCase() === "gold" && 
             product.purity?.includes("22") && 
             product.priceSource?.ratePerGram && (
              <p className="text-sm text-gray-600 mb-1">
                <strong>22K Gold Rate:</strong> ₹{formatINR(product.priceSource.ratePerGram)}/gram
                {product.priceSource.effectiveDate && (
                  <span className="text-xs text-gray-500 ml-2">
                    (Effective: {new Date(product.priceSource.effectiveDate).toLocaleDateString('en-IN')})
                  </span>
                )}
              </p>
            )}

            <p className="text-sm text-gray-600 mb-1">
              Net Weight: {product.netWeight}g | Gross: {product.grossWeight}g
            </p>

            <p className="text-sm text-gray-600 mb-1">
              Making: ₹{formatINR(product.makingCharges)} | GST: {product.gst}%
            </p>

            <p className="text-sm text-gray-600 mb-1">
              Category: {product.category}
            </p>

            <p className="text-sm text-gray-600 mb-1">
              Stock: {product.stockStatus || "Available"}
            </p>

            <p className="text-sm text-gray-600 mb-1">
              Tags: {Array.isArray(product.tags) ? product.tags.join(", ") : ""}
            </p>

            <p className="text-sm text-blue-600 mt-2">
              Thank you for shopping with Thiaworld!
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
              className="btn btn-primary gap-4 mt-4 bg-orange-500"
            >
              Write a Testimonial
            </Link>

            {/* Buttons */}
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

            {/* Call & WhatsApp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-yellow-50 border border-yellow-300 p-4 rounded">
                <h4 className="font-semibold mb-2">📹 Video Call Us</h4>
                <p className="text-sm mb-2">Speak with our expert jeweller.</p>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded">
                  Video call
                </button>
              </div>

              <div className="bg-green-50 border border-green-300 p-4 rounded">
                <h4 className="font-semibold mb-2">💬 Whatsapp</h4>
                <p className="text-sm mb-2">Chat with support anytime.</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded">
                  Chat with Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductBottom product={product} />
      <Footer />
      <style>
        {`
        .action-bar {
  gap: 12px;
}

.action-item {
  cursor: pointer;
  font-size: 22px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-item.text {
  font-size: 14px;
}

.divider {
  width: 1px;
  height: 22px;
  background-color: #e0e0e0;
}

.view-similar {
  cursor: pointer;
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 18px;

  /* Normal (light yellow) */
  border: 1px solid #facc15;       /* yellow-400 */
  color: #a16207;                  /* dark text for contrast */
  background-color: #fef9c3;       /* light yellow */

  font-weight: 500;
  transition: all 0.25s ease;
}

.view-similar:hover {
  /* Hover (dark yellow) */
  background-color: #facc15;       /* yellow-400 */
  border-color: #eab308;           /* yellow-500 */
  color: #78350f;                  /* darker text */
}


        `}
      </style>
    </>
  );
};

export default ProductDetailPage;
