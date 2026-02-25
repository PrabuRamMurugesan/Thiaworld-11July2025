import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { FaStar, FaHeart } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import Header from "./Header";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import { useWishlist } from "../context/WishlistContext";

import {
  pickFirstImageSrc,
  normalizeImages,
  buildImgSrc,
} from "../utils/imageTools";

const RecentProducts = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(25);
  const [imgErrors, setImgErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const loaderRef = useRef(null);

  const { addToCart } = useContext(CartContext);
  const { isWished, toggle } = useWishlist();
  const location = useLocation();

  const handleImageError = (productId) => {
    setImgErrors((prev) => ({ ...prev, [productId]: true }));
  };

  /** ✅ Fetch Products */
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setIsLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URI}/products/new-arrivals`
        );

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.products || [];

        setRecentProducts(data);
      } catch (err) {
        console.error("Failed to fetch new arrivals:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  /** ✅ Infinite Scroll */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting && visibleCount < recentProducts.length) {
          setVisibleCount((prev) => prev + 25);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "150px",
      }
    );

    const loader = loaderRef.current;
    if (loader) observer.observe(loader);

    return () => {
      if (loader) observer.unobserve(loader);
    };
  }, [visibleCount, recentProducts.length]);

  const visibleProducts = recentProducts.slice(0, visibleCount);

  return (
    <>
      {location.pathname !== "/" && <Header />}

      {/* ===== Header Count ===== */}
      <div className="px-8 mt-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          New Arrivals
        </h2>

        <p className="text-gray-600 text-sm">
          Showing {visibleProducts.length} of {recentProducts.length} Products
        </p>
      </div>

      {/* ===== Grid ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-8 m-5">
        {visibleProducts.map((product) => {
          const imagesSource =
            product.images ||
            product.image ||
            product.gallery_imgs ||
            product.productImages;

          const firstImg = pickFirstImageSrc(normalizeImages(imagesSource));
          const imgSrc = buildImgSrc(firstImg) || "/default-product.jpg";

          return (
            <div
              key={product._id}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition duration-300 group"
            >
              <div className="flex justify-center">
                <div className="flex flex-col w-full max-w-sm">

                  {/* IMAGE */}
                  <div className="relative">
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
                      New
                    </span>

                    <div className="overflow-hidden rounded-xl">
                      <a href={`/product/${product._id}`}>
                        {!imgErrors[product._id] ? (
                          <img
                            src={imgSrc}
                            alt={product.name}
                            loading="lazy"
                            className="w-[300px] h-[250px] p-4 object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={() => handleImageError(product._id)}
                          />
                        ) : (
                          <div className="w-full h-[300px] flex items-center justify-center bg-gray-100">
                            <img
                              src="https://image.pngaaa.com/13/1887013-middle.png"
                              alt="placeholder"
                              className="w-24 h-24 object-contain opacity-40"
                            />
                          </div>
                        )}
                      </a>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="flex flex-col p-4">
                    <h3 className="text-base font-medium text-gray-800 truncate">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {product.shortDesc || "Gold Jewellery"}
                    </p>

                    {/* Wishlist + Rating */}
                    <div className="flex items-center justify-between mt-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggle(product._id);
                        }}
                      >
                        <FaHeart
                          style={{
                            fontSize: 15,
                            color: isWished(product._id)
                              ? "#e03131"
                              : "gray",
                          }}
                        />
                      </button>

                      <div className="flex text-sm">
                        {Array(5)
                          .fill()
                          .map((_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i < (product.rating || 4)
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="product-actions">
                      <button
                        className="btn-cart"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>

                      <button
                        className="btn-buy"
                        onClick={() => addToCart(product)}
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

      {/* ===== Network Loader ===== */}
      {isLoading && (
        <div className="text-center py-10">
          <div className="spinner-border text-dark" />
        </div>
      )}

      {/* ===== Infinite Scroll Loader ===== */}
      {!isLoading && visibleCount < recentProducts.length && (
        <div ref={loaderRef} className="py-5 text-center">
          <div className="spinner-border text-secondary" />
        </div>
      )}

      {/* ===== End Message ===== */}
      {!isLoading && visibleCount >= recentProducts.length && (
        <div className="text-center py-5 text-muted">
          No more products
        </div>
      )}

      {location.pathname !== "/" && <Footer />}

      {/* ===== Styles ===== */}
      <style>
        {`
        .product-actions {
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }

        .btn-cart,
        .btn-buy {
          flex: 1;
          height: 38px;
          font-size: 13px;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .btn-cart {
          background-color: #111;
          color: white;
        }

        .btn-cart:hover {
          background-color: black;
          transform: translateY(-1px);
        }

        .btn-buy {
          background-color: #f5f5f5;
          color: #111;
          border: 1px solid #ddd;
        }

        .btn-buy:hover {
          background-color: #111;
          color: white;
          transform: translateY(-1px);
        }

        .btn-cart:active,
        .btn-buy:active {
          transform: scale(0.96);
        }

        @media (max-width: 576px) {
          .product-actions {
            flex-direction: column;
          }

          .btn-cart,
          .btn-buy {
            height: 36px;
            font-size: 12px;
          }
        }
        `}
      </style>
    </>
  );
};

export default RecentProducts;