import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaStar, FaHeart } from "react-icons/fa";
import { CartContext } from "../context/CartContext"; // ✅ adjust path if needed

const BestSellingProducts = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URI}/products/best-selling`
        );
        setProducts(response.data);
        console.log(response.data, "best-selling");
        
      } catch (error) {
        console.error("Failed to fetch best selling products:", error);
      }
    };

    fetchBestSelling();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-8 m-5">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition duration-300 group"
        >
          <div className="overflow-hidden">
            <a href={`/products/${product.slug}`}>
              <img
                src={
                  product.images?.[0]
                    ? `http://localhost:5000${product.images[0]}`
                    : "/default-product.jpg"
                }
                className="w-full h-100 object-cover group-hover:scale-105 transition duration-300"
                alt={product.name}
                onError={(e) => (e.target.src = "/default-product.jpg")}
              />
            </a>
          </div>

          <div className="p-4 ">
           <div className="mt-2 min-h-[100px]">
               <h3 className="text-base font-medium text-gray-800">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {product.shortDescription}
            </p>

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

            <div className=" d-flex justify-between align-items-center  gap-4 ">
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
  );
};

export default BestSellingProducts;
