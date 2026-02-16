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

const HomeProductSection = () => {
  const [products, setProducts] = useState([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const sectionRef = useRef(null);

  const { addToCart } = useContext(CartContext);
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

  const scrollToTop = () => {
    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      scrollToTop();
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      scrollToTop();
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const handleAddToCart = (product) => {
    if (!isLoggedIn()) {
      setShowLoginPopup(true);
      return;
    }
    addToCart(product);
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URI}/products/new-arrivals`
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / pageSize);

  const paginatedProducts = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getVisiblePages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <section ref={sectionRef} className="py-5 px-5 bg-light">
      <h2 className="text-center mb-5 font-serif text-3xl font-bold">
        Top Trending Collections
      </h2>

      <div className="row justify-content-start g-4 mx-5 py-5">
        {paginatedProducts.map((product) => {
          let currentPrice = 0;
          let previousPrice = null;

          if (product.breakdown) {
            const breakdown = product.breakdown;

            const actualPrice =
              breakdown.actualPrice ||
              (breakdown.goldValue || 0) +
                (breakdown.makingValue || 0) +
                (breakdown.wastageValue || 0) +
                (breakdown.stoneValue || 0);

            const discountAmount = breakdown.discount || 0;
            const priceAfterDiscount = actualPrice - discountAmount;

            const gstPercent = Number(product.gst || 0);
            const gstOnAfterDiscount = Math.round(
              (priceAfterDiscount * gstPercent) / 100
            );

            currentPrice = priceAfterDiscount + gstOnAfterDiscount;
            previousPrice = actualPrice;
          } else if (
            product.displaySale !== undefined &&
            product.displayActual !== undefined
          ) {
            const priceAfterDiscount = Number(product.displaySale || 0);
            const gstPercent = Number(product.gst || 0);

            const gstOnAfterDiscount = Math.round(
              (priceAfterDiscount * gstPercent) / 100
            );

            currentPrice = priceAfterDiscount + gstOnAfterDiscount;
            previousPrice = Number(product.displayActual || 0);
          } else {
            currentPrice = Number(product.finalPrice || product.price || 0);
          }

          const firstImg = pickFirstImageSrc(
            normalizeImages(product.images)
          );

          return (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3"
              key={product._id}
            >
              <div className="rounded-xl overflow-hidden p-0.5 hover:shadow-gold hover:scale-[1.02] transition-all duration-300">
                <div className="card shadow-sm position-relative">
                  
                  {product.discount > 0 && (
                    <span className="position-absolute start-0 bg-danger text-white py-1 rounded-end w-[90px] text-sm d-flex justify-content-center">
                      {product.discount}% OFF
                    </span>
                  )}

                  <button
                    onClick={(e) =>
                      handleWishlistToggle(product._id, e)
                    }
                    className="position-absolute top-2 end-2 m-2"
                    style={{ background: "transparent", border: "none" }}
                  >
                    {isWished(product._id) ? (
                      <IoMdHeart style={{ fontSize: 25, color: "#e03131" }} />
                    ) : (
                      <PiHeart style={{ fontSize: 25, color: "gray" }} />
                    )}
                  </button>

                  <Link to={`/product/${product._id}`}>
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{ height: "260px" }}
                    >
                      <img
                        src={buildImgSrc(firstImg) || "/default-product.jpg"}
                        alt={product.name}
                        style={{ width: "180px", height: "180px", objectFit: "contain" }}
                      />
                    </div>
                  </Link>

                  <div className="card-body text-center">
                    <h6 className="card-title text-nowrap">
                      {product.name}
                    </h6>

                    <div className="d-flex justify-content-center gap-2">
                      <span className="fw-bold text-success">
                        ₹{Number(currentPrice).toLocaleString("en-IN")}
                      </span>

                      {previousPrice > currentPrice && (
                        <span className="text-muted text-decoration-line-through">
                          ₹{Number(previousPrice).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    <div className="d-flex justify-content-center mt-3 gap-2">
                      <button
                        className="btn button-90 btn-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                      >
                        Add to Cart
                      </button>

                      <button
                        className="btn button-90 btn-sm"
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {products.length > pageSize && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
          
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {visiblePages[0] > 1 && (
            <>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => handlePageClick(1)}
              >
                1
              </button>
              {visiblePages[0] > 2 && <span>...</span>}
            </>
          )}

          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`btn btn-sm ${
                currentPage === page
                  ? "btn-dark"
                  : "btn-outline-secondary"
              }`}
            >
              {page}
            </button>
          ))}

          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              <span>...</span>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => handlePageClick(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <LoginPopup
        show={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />
    </section>
  );
};

export default HomeProductSection;