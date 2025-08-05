import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaStar, FaHeart } from "react-icons/fa";
import { CartContext } from "../context/CartContext"; // ✅ adjust path if needed
import Header from "./Header";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";
const RecentProducts = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URI}/products/new-arrivals`
        );
        console.log(res,"dsfgfghdfgfdg");
        
        setRecentProducts(res.data);
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
      
      {recentProducts.map((product) => (
        <div
          key={product._id}
          className="relative bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition duration-300 group"
        >
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
            New
          </span>

          <div className="overflow-hidden">
            <img
              src={
                product.images?.[0]
                  ? `http://localhost:5000${product.images[0]}`
                  : "/default-product.jpg"
              }
              className="w-100 h-[300px] object-contain group-hover:scale-105 transition duration-300"
              alt={product.name}
              onError={(e) => (e.target.src = "/default-product.jpg")}
            />
          </div>

          <div className="p-4">
            <h3 className="text-base font-medium text-gray-800">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {product.shortDesc || "Gold Jewellery"}
            </p>

            <div className="flex items-center text-yellow-500 text-sm mt-2">
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

            <div className=" d-flex justify-between align-items-center gap-3 mt-3">
              <button
                className="btn btn-warning btn-sm  w-100 fw-bold"
                onClick={() => addToCart(product)}
              >
                🛒 Add to Cart
              </button>
              <FaHeart className="text-gray-500 hover:text-red-500 cursor-pointer size-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
    {location.pathname !== "/" && <Footer />}
    </>
  );
};

export default RecentProducts;
