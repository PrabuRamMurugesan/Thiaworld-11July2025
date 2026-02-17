import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { FaStar, FaHeart } from "react-icons/fa";
import { CartContext } from "../context/CartContext"; // ✅ adjust path if needed
import Header from "./Header";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import { useWishlist } from "../context/WishlistContext";

// ✅ Same helpers as BestSelling / Featured
import {
  pickFirstImageSrc,
  normalizeImages,
  buildImgSrc,
} from "../utils/imageTools";

const RecentProducts = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const { isWished, toggle } = useWishlist();
  const [imgErrors, setImgErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const pageSize = 20;
  const sectionRef = useRef(null);
  
  const handleImageError = (productId) => {
    setImgErrors((prev) => ({ ...prev, [productId]: true }));
  };

  const isLoggedIn = () => {
    return !!localStorage.getItem("user") || !!localStorage.getItem("authToken");
  };

  const totalPages = Math.ceil(recentProducts.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const paginatedProducts = recentProducts.slice(startIdx, endIdx);

  const visiblePages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }
  for (let i = start; i <= end; i++) {
    visiblePages.push(i);
  }

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URI}/products/new-arrivals`,
        );

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.products || [];

        setRecentProducts(data);
      } catch (err) {
        console.error("Failed to fetch new arrivals:", err);
      }
    };

    fetchNewArrivals();
  }, []);

  const location = useLocation();
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

  const closeLoginPopup = () => {
  };
  return (
    <>
      {location.pathname !== "/" && <Header />}

      <div ref={sectionRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-8 m-5">
        {paginatedProducts.map((product) => {
          // ✅ SAME IMAGE PIPE/FILENAME LOGIC
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
              className="relative bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition duration-300 group"
            >
   <div className="flex justify-center">
  <div className="flex flex-col w-full max-w-sm">

    {/* IMAGE SECTION */}
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
              className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => handleImageError(product._id)}
            />
          ) : (
            <div className="w-full h-[300px] flex items-center justify-center bg-gray-100">
              <img
                src="https://image.pngaaa.com/13/1887013-middle.png"
                alt="Product placeholder"
                className="w-24 h-24 object-contain opacity-40"
              />
            </div>
          )}
        </a>
      </div>
    </div>

    {/* CONTENT SECTION */}
    <div className="flex flex-col p-4 ">

      {/* Title & Description */}
      <h3 className="text-base font-medium text-gray-800 truncate">
        {product.name}
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        {product.shortDesc || "Gold Jewellery"}
      </p>

      {/* Wishlist + Rating */}
      <div className="flex items-center justify-between mt-3">
        <button
          aria-label="Toggle wishlist"
          onClick={(e) => {
            e.preventDefault();
            toggle(product._id);
          }}
        >
          <FaHeart
            style={{
              fontSize: 15,
              color: isWished(product._id) ? "#e03131" : "gray",
              transition: "color 120ms ease",
            }}
          />
        </button>

        <div className="flex items-center text-sm">
          {Array(5).fill().map((_, i) => (
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
      <div className="flex gap-2 mt-3">
        <button
          className="btn button-90 btn-sm fw-bold w-full whitespace-nowrap"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>

        <button
          className="btn button-90 btn-sm fw-bold w-full whitespace-nowrap"
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
      {recentProducts.length > pageSize && (
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
                currentPage === page ? "btn-dark" : "btn-outline-secondary"
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
      {location.pathname !== "/" && <Footer />}
    </>
  );
};

export default RecentProducts;
