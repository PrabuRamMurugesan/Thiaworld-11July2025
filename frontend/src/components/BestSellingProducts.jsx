import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaStar, FaHeart } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import {
  pickFirstImageSrc,
  normalizeImages,
  buildImgSrc,
} from "../utils/imageTools";

// Adjust this if your API base is different
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

const BestSellingProducts = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const { isWished, toggle } = useWishlist();

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        // If your endpoint path is different, change only this URL:
        const response = await axios.get(
          `${API_BASE}/api/products/best-selling`
        );
        setProducts(response.data?.items || response.data || []);
      } catch (error) {
        console.error("Error fetching best-selling products:", error);
      }
    };

    fetchBestSelling();
  }, []);

  const formatPrice = (value) => {
    const n = Number(value || 0);
    if (!Number.isFinite(n)) return "₹0";
    return `₹${n.toLocaleString("en-IN")}`;
  };

  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-4">Best Selling Products</h2>

      <div className="row g-3">
        {products.map((product) => {
          // ----- pricing -----
          const sale =
            product.displaySale ??
            product.displayPrice ??
            product.totalPayable ??
            product.price ??
            0;

          const mrp =
            product.displayActual ??
            (Number(product.discount || 0) > 0 ? product.price : null);

          const discountPct = Number(product.discount || 0);

          // ----- image -----
          const firstImg = pickFirstImageSrc(
            normalizeImages(product.images || product.image)
          );
          const imgSrc = buildImgSrc(firstImg) || "/default-product.jpg";

          const wished = isWished(product._id);

          return (
            <div
              key={product._id}
              className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
            >
              <div className="card shadow-sm w-100 h-100 position-relative">
                {/* Discount badge */}
                {discountPct > 0 && (
                  <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                    {discountPct}% OFF
                  </span>
                )}

                {/* Wishlist icon */}
                <button
                  type="button"
                  className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2 p-1"
                  onClick={() => toggle(product)}
                >
                  {wished ? (
                    <FaHeart className="text-danger" />
                  ) : (
                    <IoMdHeart className="text-secondary" />
                  )}
                </button>

                {/* Image */}
                <a href={`/product/${product._id}`}>
                  <img
                    src={imgSrc}
                    alt={product.name}
                    className="card-img-top"
                    style={{ height: 260, objectFit: "cover" }}
                    onError={(e) => {
                      e.currentTarget.src = "/default-product.jpg";
                    }}
                  />
                </a>

                <div className="card-body d-flex flex-column">
                  {/* Name */}
                  <h6 className="card-title text-truncate" title={product.name}>
                    {product.name}
                  </h6>

                  {/* Rating (static stars for now) */}
                  <div className="d-flex align-items-center mb-2">
                    <FaStar className="text-warning me-1" />
                    <FaStar className="text-warning me-1" />
                    <FaStar className="text-warning me-1" />
                    <FaStar className="text-warning me-1" />
                    <FaStar className="text-warning me-2" />
                    <small className="text-muted">Best Seller</small>
                  </div>

                  {/* Prices */}
                  <div className="mb-2">
                    <span className="fw-bold me-2">{formatPrice(sale)}</span>
                    {mrp && mrp > sale && (
                      <span className="text-muted text-decoration-line-through">
                        {formatPrice(mrp)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm fw-bold text-nowrap"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      className="btn button-90 btn-sm fw-bold text-nowrap"
                      onClick={() => addToCart(product)}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {products.length === 0 && (
          <div className="col-12 text-center text-muted">
            No best-selling products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSellingProducts;
