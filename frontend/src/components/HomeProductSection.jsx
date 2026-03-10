import React, { useEffect, useState, useContext, useRef } from "react";
import { IoMdHeart } from "react-icons/io";
import { PiHeart } from "react-icons/pi";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { AuthContext } from "../../context/AuthContext";
import {
  pickFirstImageSrc,
  normalizeImages,
  buildImgSrc,
} from "../utils/imageTools";
import LoginPopup from "./LoginPopup";
import { ToastContainer, toast } from "react-toastify";
const HomeProductSection = () => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(25);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [imgErrors, setImgErrors] = useState({});

  const loaderRef = useRef(null);

  const { addToCart, removeFromCart, mergedCart } = useContext(CartContext);
  const { isWished, toggle } = useWishlist();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const isLoggedIn = () => {
    try {
      const stored = localStorage.getItem("bbsUser");
      return stored && JSON.parse(stored)?.token;
    } catch {
      return false;
    }
  };

  const handleImageError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };
  const handleAddToCart = (product) => {
    if (!isLoggedIn()) {
      setShowLoginPopup(true);
      return;
    }

    const productId = String(product._id);

    const alreadyInCart = mergedCart?.find(
      (item) => String(item._id) === productId
    );

    if (alreadyInCart) {
      toast.error("Only one quantity allowed for this product");
      return;
    }

    addToCart(product);
    toast.success("Product added to cart");
  };
  const handleWishlistToggle = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn()) {
      setShowLoginPopup(true);
      return;
    }
    toggle(productId);
  };

  /** ✅ Fetch Products */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URI}/products/new-arrivals`,
        );
        setProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  /** ✅ Infinite Scroll */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting && visibleCount < products.length) {
          setVisibleCount((prev) => prev + 25);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "150px",
      },
    );

    const loader = loaderRef.current;
    if (loader) observer.observe(loader);

    return () => {
      if (loader) observer.unobserve(loader);
    };
  }, [visibleCount, products.length]);

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <>
      <section className="py-5 px-5 bg-light ">
        <h2 className="text-center mb-5 font-serif text-3xl font-bold">
          Top Trending Collections
        </h2>

        <div className="row justify-content-start g-4 mx-5 py-5">
          {visibleProducts.map((product, index) => {
            const productId = String(product._id);

            const cartItem = mergedCart?.find(
              (item) => String(item._id) === productId
            );

            const isInCart = !!cartItem;
            let currentPrice = Number(product.finalPrice || product.price || 0);
            let previousPrice = null;

            if (product.displayActual) {
              previousPrice = Number(product.displayActual);
            }

            const firstImg = pickFirstImageSrc(normalizeImages(product.images));

            return (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3"
                key={product._id}
                style={{
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                <div className="product-card rounded-xl overflow-hidden">
                  <div className="card shadow-sm position-relative">
                    {/* Wishlist */}
                    <button
                      onClick={(e) => handleWishlistToggle(product._id, e)}
                      className="position-absolute top-2 end-2 m-2"
                      style={{ background: "transparent", border: "none" }}
                    >
                      {isWished(product._id) ? (
                        <IoMdHeart className="wishlist-icon active" />
                      ) : (
                        <PiHeart className="wishlist-icon" />
                      )}
                    </button>

                    {/* Image */}
                    <Link to={`/product/${product._id}`}>
                      <div className="image-wrapper">
                        {!imgErrors[product._id] ? (
                          <img
                            src={
                              buildImgSrc(firstImg) || "/default-product.jpg"
                            }
                            alt={product.name}
                            loading="lazy"
                            onError={() => handleImageError(product._id)}
                          />
                        ) : (
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png"
                            alt="fallback"
                            className="fallback-img"
                            style={{ width: "600px" }}
                          />
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="card-body text-center">
                      <h6 className="card-title text-nowrap">{product.name}</h6>

                      <div className="d-flex justify-content-center gap-2">
                        <span className="fw-bold text-success">
                          ₹{currentPrice.toLocaleString("en-IN")}
                        </span>

                        {previousPrice > currentPrice && (
                          <span className="text-muted text-decoration-line-through">
                            ₹{previousPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      <div className="product-actions">

                        {isInCart ? (

                          <div className="qty-box">
                            <button
                              className="qty-btn"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                const item = mergedCart?.find(
                                  (i) => String(i._id) === String(product._id)
                                );

                                if (item) {
                                  const category = (item.category || item.metalType || "").toLowerCase();

                                  removeFromCart(item.cartItemId, category);
                                  toast.info("Product removed from cart");
                                }
                              }}
                            >
                              -
                            </button>

                            <span>1</span>

                            <button className="qty-btn" disabled>
                              +
                            </button>

                          </div>

                        ) : (

                          <>
                            <button
                              className="btn-cart"
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart(product);
                              }}
                            >
                              Add to Cart
                            </button>

                            <button
                              className="btn-buy"
                              onClick={(e) => {
                                e.preventDefault();

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
                          </>

                        )}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Loader */}
        {visibleCount < products.length && (
          <div ref={loaderRef} className="py-5 text-center">
            <div className="spinner-border text-dark" />
          </div>
        )}

        <LoginPopup
          show={showLoginPopup}
          onClose={() => setShowLoginPopup(false)}
        />
      </section>
      <style>
        {` 
      .product-card {
  animation: fadeZoomIn 0.6s ease forwards;
  transform: scale(0.95);
  opacity: 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

@keyframes fadeZoomIn {
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.product-card:hover {
  transform: scale(1.03);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

/* Image */
.image-wrapper {
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-wrapper img {
  width: 180px;
  height: 180px;
  object-fit: contain;
  transition: transform 0.4s ease;
}

.product-card:hover img {
  transform: scale(1.08);
}

.fallback-img {
  opacity: 0.5;
}

/* Wishlist */
.wishlist-icon {
  font-size: 24px;
  color: gray;
  transition: transform 0.2s ease, color 0.2s ease;
}

.wishlist-icon:hover {
  transform: scale(1.2);
}

.wishlist-icon.active {
  color: #e03131;
}

/* Base Button */
.btn-cart,
.btn-buy {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 25px;
  border: none;
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: 110px;
}
.qty-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #eee;
  font-size: 16px;
  border-radius: 4px;
}

.qty-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
/* Add to Cart */
.btn-cart {
  background: linear-gradient(135deg, #000000, #000000);
  color: #fff;
}

.btn-cart:hover {
  background: linear-gradient(135deg,  #000000, #000000);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Buy Now */
.btn-buy {
  background: linear-gradient(135deg, #c9c751, #d3d625);
  color: #fff;
}

.btn-buy:hover {
  background: linear-gradient(135deg, #c9c751, #d3d625);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(224, 49, 49, 0.3);
}

/* Click Effect */
.btn-cart:active,
.btn-buy:active {
  transform: scale(0.96);
}
  /* ===== Product Buttons Wrapper ===== */
.product-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}

/* ===== Common Button Style ===== */
.btn-cart,
.btn-buy {
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 90px;
}

/* Cart Button */
.btn-cart {
  background-color: #f1f1f1;
  White-space: nowrap;
}

.btn-cart:hover {
  background-color: #e0e0e0;
}

/* Buy Button */
.btn-buy {
  background-color: #111;
  color: #fff;
}

.btn-buy:hover {
  background-color: #000;
}
.qty-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.qty-box span {
  min-width: 20px;
  text-align: center;
  font-weight: 600;
}

.qty-box button:last-child {
  width: 28px;
  height: 28px;
  background: #eee;
  border: none;
  cursor: not-allowed;
}
/* ===== Tablet Responsive ===== */
@media (max-width: 992px) {
  .btn-cart,
  .btn-buy {
    padding: 5px 10px;
    font-size: 12px;
    min-width: 80px;
  }
}

/* ===== Mobile Responsive ===== */
@media (max-width: 576px) {
  .product-actions {
    gap: 6px;
  }

  .btn-cart,
  .btn-buy {
    padding: 4px 8px;
    font-size: 11px;
    min-width: 70px;
    border-radius: 5px;
  }
}
      `}
      </style>
    </>
  );
};

export default HomeProductSection;
