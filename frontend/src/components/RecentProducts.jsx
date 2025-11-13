import React, { useEffect, useState, useContext } from "react";
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

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URI}/products/new-arrivals`
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

  return (
    <>
      {location.pathname !== "/" && <Header />}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-8 m-5">
        {recentProducts.map((product) => {
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
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
                New
              </span>

              <div className="overflow-hidden">
                <a href={`/product/${product._id}`}>
                  <img
                    src={imgSrc}
                    className="w-[500px] h-[350px] overflow-hidden rounded-xl bg-[#1c1a17] flex items-center justify-center object-cover"
                    alt={product.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-product.jpg";
                    }}
                  />
                </a>
              </div>

              <div className="p-4">
                <h3 className="text-base font-medium text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {product.shortDesc || "Gold Jewellery"}
                </p>

                <div className="d-flex align-items-center justify-content-between mt-3">
                  {/* Wishlist heart */}
                  <button
                    aria-label="Toggle wishlist"
                    onClick={(e) => {
                      e.preventDefault();
                      toggle(product._id);
                    }}
                    title={
                      isWished(product._id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    <FaHeart
                      style={{
                        fontSize: 15,
                        color: isWished(product._id) ? "#e03131" : "gray",
                        transition: "color 120ms ease",
                      }}
                    />
                  </button>

                  {/* Rating */}
                  <div className="flex items-center text-yellow-500 text-sm ">
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

                <div className="d-flex justify-between align-items-center gap-1 mt-3">
                  <button
                    className="btn button-90 btn-sm fw-bold text-nowrap"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn button-90 btn-sm fw-bold text-nowrap"
                    onClick={() => addToCart(product)}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {location.pathname !== "/" && <Footer />}
    </>
  );
};

export default RecentProducts;
