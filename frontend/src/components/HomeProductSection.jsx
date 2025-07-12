import React, { useEffect, useState, useContext } from "react";
import { IoMdHeart } from "react-icons/io";
import axios from "axios";
import { CartContext } from "../context/CartContext"; // ✅ adjust path if needed

const HomeProductSection = () => {
  const [products, setProducts] = useState([]);
  const [liked, setLiked] = useState({});
  const { addToCart } = useContext(CartContext);
  const API = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios
      .get(`${API}/api/products`) // 🔁 Replace with your backend URL if different
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleHeartClick = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-5 px-4 bg-light">
      <h2 className="text-center mb-5 font-serif text-3xl font-bold  ">
        Top Trending Collections
      </h2>
      <div className="row justify-content-center g-4">
        {products.map((product) => {
          const currentPrice = product.price;
          const previousPrice = Math.round(
            currentPrice / (1 - product.discount / 100)
          );
          const saveRate = Math.round(
            ((previousPrice - currentPrice) / previousPrice) * 100
          );

          return (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3"
              key={product._id}
            >
              <div
                className="card shadow-sm position-relative"
                style={{ borderRadius: "12px" }}
              >
                {/* SALE Tag */}
                <span
                  className="position-absolute top-2 start-0 bg-danger text-white  py-1
                rounded-end   w-[100px]  text-sm  font-serif align-items-center d-flex justify-center "
                  style={{ width: "90px" }}
                >
                  {product.discount}% OFF
                </span>

                {/* Heart Icon */}
                <span
                  className="position-absolute top-2 end-3 p-1"
                  onClick={() => handleHeartClick(product._id)}
                  style={{ cursor: "pointer" }}
                >
                  <IoMdHeart
                    size={25}
                    color={liked[product._id] ? "red" : "orange"}
                  />
                </span>

                {/* Image */}
                <img
                  src={
                    product.images?.[0]
                      ? `${API}${product.images[0]}`
                      : "/default-product.jpg"
                  }
                  className="w-100 h-[400px] object-contain  "
                  alt={product.name}
                  onError={(e) => (e.target.src = "/default-product.jpg")}
                />

                <div className="card-body text-center">
                  <h6 className="card-title mb-2">{product.name}</h6>
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <span className="fw-bold text-success">
                      ₹{currentPrice}
                    </span>
                    <span className="text-muted text-decoration-line-through">
                      ₹{previousPrice}
                    </span>
                    {/* <span className="text-danger small fw-bold">
                      Save {saveRate}%
                    </span> */}
                  </div>
                  <button
                    className="btn btn-warning btn-sm mt-3 w-100 fw-bold"
                    onClick={() => addToCart(product)}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HomeProductSection;
