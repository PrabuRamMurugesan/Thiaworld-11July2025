import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaStar, FaHeart } from "react-icons/fa";
import { CartContext } from "../context/CartContext"; // ✅ adjust path if needed
import { useWishlist } from "../context/WishlistContext";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const { isWished, toggle } = useWishlist();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URI}/products/featured`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-8 m-5">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition duration-300 group"
        >
          {/* Product Image */}
          <div className="overflow-hidden">
            <a href={`/product/${product._id}`}>
              <img
                src={
                  product.images?.[0]
                    ? product.images[0] // ✅ use as-is
                    : "/default-product.jpg"
                }
                className="w-100 h-[400px] object-contain group-hover:scale-105 transition duration-300"
                alt={product.name}
                onError={(e) => (e.target.src = "/default-product.jpg")}
              />
            </a>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="mt-2 min-h-[100px]">
              <h3 className="text-base font-medium text-gray-800">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {product.shortDescription}
              </p>

              {/* Star Rating */}
              <div className="flex items-center text-yellow-500 text-sm mt-2">
                {[...Array(5)].map((_, i) => (
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
            <div className="d-flex justify-between align-items-center gap-3">
              <button
                className="btn btn-warning btn-sm  w-100 fw-bold"
                onClick={() => addToCart(product)}
              >
                🛒 Add to Cart
              </button>
     {/* Heart Icon (Top-Right) */}
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
                    fontSize: 25,
                    color: isWished(product._id) ? "#e03131" : "gray",
                    transition: "color 120ms ease",
                  }}
                />
              </button>            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;
