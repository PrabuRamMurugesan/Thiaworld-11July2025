import React, { useEffect, useState, useContext } from "react";
import { IoMdHeart } from "react-icons/io";
import { PiHeart } from "react-icons/pi";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext"; // ✅ adjust path if needed
import { useWishlist } from "../context/WishlistContext";
import { AuthContext } from "../../context/AuthContext";
import { FaStar, FaHeart } from "react-icons/fa";
import {
  pickFirstImageSrc,
  normalizeImages,
  buildImgSrc,
} from "../utils/imageTools";
import LoginPopup from "./LoginPopup";

const HomeProductSection = () => {
  const [products, setProducts] = useState([]);
  const [liked, setLiked] = useState({});
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { isWished, toggle } = useWishlist();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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

  // Handle wishlist toggle with login check
  const handleWishlistToggle = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn()) {
      setShowLoginPopup(true);
      return;
    }
    toggle(productId);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URI}/products/new-arrivals`);
        const productsData = res.data;
        
        // Debug: Check if breakdown is present
        if (productsData.length > 0) {
          const firstProduct = productsData[0];
          console.log('Sample product from API:', {
            id: firstProduct._id,
            name: firstProduct.name,
            hasBreakdown: !!firstProduct.breakdown,
            breakdown: firstProduct.breakdown,
            displaySale: firstProduct.displaySale,
            displayActual: firstProduct.displayActual,
            price: firstProduct.price,
            finalPrice: firstProduct.finalPrice
          });
        }
        
        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    
    fetchProducts();
  }, []);

  const handleHeartClick = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-5 px-5 bg-light">
      <h2 className="text-center mb-5 font-serif text-3xl font-bold  ">
        Top Trending Collections
      </h2>
      <div className="row justify-content-start g-4 mx-5">
        {products.map((product) => {
          // Calculate price same way as ProductDetail page
          let currentPrice = 0;
          let previousPrice = null;

          // Always prefer breakdown if available (same as ProductDetail)
          if (product.breakdown) {
            // Use breakdown to calculate prices (same as ProductDetail)
            const breakdown = product.breakdown;
            const actualPrice = breakdown.actualPrice || 
              (breakdown.goldValue || 0) + 
              (breakdown.makingValue || 0) + 
              (breakdown.wastageValue || 0) + 
              (breakdown.stoneValue || 0);
            
            const discountAmount = breakdown.discount || 0;
            const priceAfterDiscount = actualPrice - discountAmount;
            // Match ProductDetail: use product.gst, default to 0
            const gstPercent = Number(product.gst || 0);
            // Match ProductDetail calculation exactly (with rounding)
            const gstOnAfterDiscount = Math.round((priceAfterDiscount * gstPercent) / 100);
            currentPrice = priceAfterDiscount + gstOnAfterDiscount;
            
            // Previous price = actualPrice (price before discount)
            previousPrice = actualPrice;
          } else if (product.displaySale !== undefined && product.displayActual !== undefined) {
            // If breakdown not available but backend computed displaySale/displayActual
            // displaySale is price AFTER discount but BEFORE GST
            // So we need to add GST to match ProductDetail calculation
            const priceAfterDiscount = Number(product.displaySale || product.displayPrice || 0);
            const gstPercent = Number(product.gst || 0);
            const gstOnAfterDiscount = Math.round((priceAfterDiscount * gstPercent) / 100);
            currentPrice = priceAfterDiscount + gstOnAfterDiscount;
            
            // Previous price = displayActual (price before discount)
            previousPrice = Number(product.displayActual || 0);
          } else {
            // Last fallback: use product price fields (but warn in console)
            console.warn(`Product ${product._id} (${product.name}) missing breakdown and displaySale. Using fallback price.`, {
              hasBreakdown: !!product.breakdown,
              displaySale: product.displaySale,
              displayActual: product.displayActual,
              finalPrice: product.finalPrice,
              price: product.price
            });
            currentPrice = Number(product.finalPrice || product.totalPayable || product.price || 0);
            // Calculate previous price from discount if available
            if (product.discount && currentPrice > 0) {
              previousPrice = Math.round(currentPrice / (1 - product.discount / 100));
            }
          }

          const firstImg = pickFirstImageSrc(normalizeImages(product.images));
          return (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 "
              key={product._id}
            >
              <div
                className="rounded-xl overflow-hidden p-0.5 
               hover:shadow-gold hover:scale-[1.02] transition-all duration-300"
              >
                <div className="card shadow-sm position-relative ">
                  {/* SALE Tag (Top-Left) */}
                  <span
                    className="position-absolute top-60 start-0 bg-danger text-white py-1 rounded-end w-[100px] 
                  text-sm font-serif d-flex justify-content-center"
                    style={{ width: "90px" }}
                  >
                    {product.discount}% OFF
                  </span>

                  {/* Heart Icon (Top-Right) */}
                  <button
                    aria-label="Toggle wishlist"
                    onClick={(e) => handleWishlistToggle(product._id, e)}
                    className="position-absolute top-2 end-2 m-2"
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      zIndex: 10,
                    }}
                    title={
                      isWished(product._id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    {isWished(product._id) ? (
                      <IoMdHeart
                        style={{
                          fontSize: 25,
                          color: "#e03131",
                          transition: "color 120ms ease",
                        }}
                      />
                    ) : (
                      <PiHeart
                        style={{
                          fontSize: 25,
                          color: "gray",
                          transition: "color 120ms ease",
                        }}
                      />
                    )}
                  </button>

                  <Link
                    to={`/product/${product._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      className="w-full d-flex align-items-center justify-content-center"
                      style={{
                        height: "260px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        padding: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={buildImgSrc(firstImg) || "/default-product.jpg"}
                        alt={product.name}
                        style={{
                          width: "240px",
                          height: "240px",
                          objectFit: "contain",
                          display: "block",
                          maxWidth: "180px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        onError={(e) =>
                          (e.currentTarget.src = "/default-product.jpg")
                        }
                      />
                    </div>
                  </Link>
                  <div className="card-body text-center">
                    <Link
                      to={`/product/${product._id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <h6 className="card-title mb-2 text-nowrap" style={{ cursor: "pointer" }}>
                        {product.name}
                      </h6>
                    </Link>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <span className="fw-bold text-success">
                        ₹
                        {Number(currentPrice).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>

                      {previousPrice && previousPrice > currentPrice && (
                        <span className="text-muted text-decoration-line-through">
                          ₹
                          {Number(previousPrice).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      )}
                    </div>

                    <div className=" d-flex justify-center mt-3 align-items-center  gap-1 ">
                      <button
                        className="btn button-90 btn-sm fw-bold px-4"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="btn button-90   btn-sm fw-bold px-3"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (isLoggedIn()) {
                            handleAddToCart(product);
                            navigate("/checkout");
                          } else {
                            setShowLoginPopup(true);
                          }
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <LoginPopup
        show={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />
    </section>
  );
};

export default HomeProductSection;
