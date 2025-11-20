import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaStar, FaHeart } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { motion } from "framer-motion";
// ✅ use the same image helpers as BestSellingProducts
import {
  pickFirstImageSrc,
  normalizeImages,
  buildImgSrc,
} from "../utils/imageTools";

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
        // In case API returns { products: [...] }
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.products || [];
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <>
        <motion.div
            className="position-relative  p-3"
            style={{ width: "100%" }}
            initial={{ opacity: 0, y: 40 }} // start hidden
            whileInView={{ opacity: 1, y: 0 }} // animate on scroll
            viewport={{ once: false, amount: 0.2 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              type: "spring",
              stiffness: 120,
            }}
          >
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-8 m-5">
      {products.map((product) => {
        // ✅ SAME IMAGE LOGIC AS BEST SELLING
        const firstImg = pickFirstImageSrc(
          normalizeImages(
            product.images ||
              product.image ||
              product.gallery_imgs ||
              product.productImages
          )
        );
        const imgSrc = buildImgSrc(firstImg) || "/default-product.jpg";

        return (
          <div
            key={product._id}
            className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition duration-300 group"
          >
            {/* Product Image */}
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

            {/* Product Info */}
            <div className="p-4">
              <div className="mt-2 min-h-[100px]">
                <h3 className="text-base font-medium text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {product.shortDescription}
                </p>

                <div className="d-flex align-items-center justify-content-between mt-3">
                  {/* Star Rating */}
                  <div className="flex items-center text-yellow-500 text-sm">
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

                  {/* Heart Icon (Wishlist) */}
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
                </div>
              </div>

              {/* Buttons */}
              <div
                className="d-flex justify-content-start flex-wrap 
            flex-row align-items-center gap-1"
              >
                <button
                  className="btn button-90 btn-sm fw-bold text-nowrap"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
                <button
                  className="btn button-90 btn-sm fw-bold text-wrap"
                  onClick={() => addToCart(product)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <style>
        {`
        .button-90 {
          background-image: linear-gradient(#0dccea, #0d70ea);
          border: 0;
          border-radius: 40px;
          box-shadow: rgba(0, 0, 0, .3) 0 5px 15px;
          box-sizing: border-box;
          color: #fff;
          cursor: pointer;
          font-family: Montserrat,sans-serif;
          font-size: .9em;
          margin: 5px;
          padding: 10px 15px;
          text-align: center;
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
        }
      `}
      </style>
    </div> </motion.div>  
    </>
  );
};

export default FeaturedProducts;
