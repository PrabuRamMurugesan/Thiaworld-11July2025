import React, { useEffect, useState, useContext } from "react";
import { IoMdHeart } from "react-icons/io";
import axios from "axios";
import { CartContext } from "../context/CartContext"; // ✅ adjust path if needed
import { useWishlist } from "../context/WishlistContext";
import { FaStar, FaHeart } from "react-icons/fa";
import {
  pickFirstImageSrc,
  normalizeImages,
  buildImgSrc,
} from "../utils/imageTools";
const HomeProductSection = () => {
  const [products, setProducts] = useState([]);
  const [liked, setLiked] = useState({});
  const { addToCart } = useContext(CartContext);
  const { isWished, toggle } = useWishlist();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URI}/products/new-arrivals`) // 🔁 Replace with your backend URL if different
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
          const currentPrice = Number(product.price).toFixed(0);

          const previousPrice = Math.round(
            currentPrice / (1 - product.discount / 100)
          );
          const saveRate = Math.round(
            ((previousPrice - currentPrice) / previousPrice) * 100
          );
          const firstImg = pickFirstImageSrc(normalizeImages(product.images));
          return (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 "
              key={product._id}
            >
              <div className="border rounded-xl overflow-hidden p-0.5 bg-gradient-to-br from-[#504e4e] via-[#a5a3a2] to-[#e4b6b6] hover:shadow-gold hover:scale-[1.02] transition-all duration-300">
                <div className="card shadow-sm position-relative ">
                  {/* SALE Tag (Top-Left) */}
                  <span
                    className="position-absolute top-60 start-0 bg-danger text-white py-1 rounded-end w-[100px] 
                  text-sm font-serif d-flex justify-content-center"
                    style={{ width: "90px" }}
                  >
                    {product.discount}% OFF
                  </span>

                  {/* Heart Icon (Top-Right) */}
                  <button
                    aria-label="Toggle wishlist"
                    onClick={(e) => {
                      e.preventDefault();
                      toggle(product._id);
                    }}
                    className="position-absolute top-2 end-2 m-2"
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                    title={
                      isWished(product._id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    <IoMdHeart
                      style={{
                        fontSize: 25,
                        color: isWished(product._id) ? "#e03131" : "gray",
                        transition: "color 120ms ease",
                      }}
                    />
                  </button>

                  <div
                    className="w-full d-flex align-items-center justify-content-center"
                    style={{
                      height: "260px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      padding: "8px",
                    }}
                  >
                    <img
                      src={buildImgSrc(firstImg) || "/default-product.jpg"}
                      alt={product.name}
                      style={{
                        width: "240px",
                        height: "240px",
                        objectFit: "contain", // <-- stops stretching and keeps full image visible
                        display: "block",
                      }}
                      onError={(e) =>
                        (e.currentTarget.src = "/default-product.jpg")
                      }
                    />
                  </div>
                  <div className="card-body text-center">
                    <h6 className="card-title mb-2">{product.name}</h6>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <span className="fw-bold text-success">
                        ₹{currentPrice}
                      </span>
                      <span className="text-muted text-decoration-line-through">
                        ₹{previousPrice}
                      </span>
                    </div>

                    <div className=" d-flex justify-center mt-3 align-items-center  gap-1 ">
                      <button
                        className="btn button-90 btn-sm fw-bold px-4"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="btn button-90   btn-sm fw-bold px-3"
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
    </section>
  );
};

export default HomeProductSection;
