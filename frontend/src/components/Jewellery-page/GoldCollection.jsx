import React, { useEffect, useMemo, useState, useContext, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../../context/AuthContext";
import Header from "../Header";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { IoMdHeart } from "react-icons/io";
import { PiHeart } from "react-icons/pi";
import { pickFirstImageSrc, buildImgSrc } from "../../utils/imageTools";
import { motion } from "framer-motion";
import LoginPopup from "../LoginPopup";
import { useWishlist } from "../../context/WishlistContext";

function formatINR(n) {
  return Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const GoldCollection = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [imgErrors, setImgErrors] = useState({});
  const loaderRef = useRef(null);

  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { isWished, toggle } = useWishlist();

  /* ================= LOGIN CHECK ================= */
  const isLoggedIn = () => {
    try {
      const stored = localStorage.getItem("bbsUser");
      return stored && JSON.parse(stored)?.token;
    } catch {
      return false;
    }
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn()) {
      setShowLoginPopup(true);
      return;
    }

    addToCart(product);
  };

  const handleWishlistToggle = (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn()) {
      setShowLoginPopup(true);
      return;
    }

    toggle(id);
  };

  const handleImageError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URI}/products/gold`
        );
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.items || [];
        setAllProducts(data || []);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ================= FILTERS ================= */
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("");

  const filteredSorted = useMemo(() => {
    let list = allProducts.slice();

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        String(p.name || "").toLowerCase().includes(q)
      );
    }

    if (sortOption === "priceAsc") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOption === "priceDesc") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortOption === "newest") {
      list.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }

    return list;
  }, [allProducts, search, sortOption]);

  /* ================= INFINITE SCROLL ================= */
  const [visibleCount, setVisibleCount] = useState(25);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          visibleCount < filteredSorted.length
        ) {
          setLoadingMore(true);

          setTimeout(() => {
            setVisibleCount((prev) => prev + 25);
            setLoadingMore(false);
          }, 700);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [visibleCount, filteredSorted.length]);

  const visibleProducts = filteredSorted.slice(0, visibleCount);

  const totalProducts = filteredSorted.length;
  const showingProducts = visibleProducts.length;

  if (loading) return <p className="text-center my-5">Loading...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <>
      <Header />
      <Navbar />

      <div className="collection-container">
        <h1 className="page-title">Gold Collection</h1>

        <div className="products-count">
          Showing {showingProducts} of {totalProducts} products
        </div>

        <div className="controls-row">
          <input
            type="text"
            placeholder="Search gold..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="newest">New Arrivals</option>
            <option value="priceAsc">Price: Low → High</option>
            <option value="priceDesc">Price: High → Low</option>
          </select>
        </div>

        <section className="products-grid">
          {visibleProducts.map((prod) => {
            const img = buildImgSrc(pickFirstImageSrc(prod.images));
            const wished = isWished(prod._id);


          <div className="d-flex flex-wrap align-items-center gap-3">
            <span className="fw-bold me-2">Purity:</span>
            {["18K", "22K", "24K"].map((p) => (
              <label
                key={p}
                className="d-flex align-items-center gap-1 text-sm"
              >
                <input
                  type="checkbox"
                  checked={purityFilter.includes(p)}
                  onChange={() => togglePurity(p)}
                />
                {p}
              </label>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <section className="d-flex flex-row flex-wrap justify-start gap-4">
          {paginatedProducts.map((prod) => {
            const firstImg = pickFirstImageSrc(prod.images);
            // Calculate price same way as ProductDetail page
            let payableBase = 0;

            let strike = null;

            if (prod.breakdown) {
              // Use breakdown to calculate prices (same as ProductDetail)
              const breakdown = prod.breakdown;
              const actualPrice =
                breakdown.actualPrice ||
                (breakdown.goldValue || 0) +
                  (breakdown.makingValue || 0) +
                  (breakdown.wastageValue || 0) +
                  (breakdown.stoneValue || 0);

              const discountAmount = breakdown.discount || 0;
              const priceAfterDiscount = actualPrice - discountAmount;
              const gstPercent = Number(prod.gst || 0);
              const gstOnAfterDiscount = Math.round(
                (priceAfterDiscount * gstPercent) / 100,
              );
              payableBase = priceAfterDiscount + gstOnAfterDiscount;

              // Strike price = actualPrice (price before discount)
              strike = actualPrice;
            } else {
              // Fallback to product price fields if no breakdown
              payableBase = Number(
                prod.finalPrice || prod.totalPayable || prod.price || 0,
              );
            }            return (
              <motion.div
                key={prod._id}
                className="product-card"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="card-icons">
                  <button
                    className={`wishlist-btn ${wished ? "active" : ""}`}
                    onClick={(e) => handleWishlistToggle(prod._id, e)}
                  >
                    {wished ? <IoMdHeart /> : <PiHeart />}
                  </button>
                </div>

                <Link to={`/product/${prod._id}`}>
                  {!imgErrors[prod._id] ? (
                    <img
                      src={img}
                      alt={prod.name}
                      onError={() => handleImageError(prod._id)}
                    />
                  ) : (
                    <img
                      src="https://static.vecteezy.com/system/resources/previews/022/014/063/original/missing-picture-page-for-website-design-or-mobile-app-design-no-image-available-icon-vector.jpg"
                      alt="placeholder"
                    />
                  )}
                </Link>
<h3 className="text-nowrap">{prod.name}</h3>
                <p className="price">₹{formatINR(prod.price)}</p>

                <button
                  className="cart-btn"
                  onClick={(e) => handleAddToCart(prod, e)}
                >
                  Add to Cart
                </button>
              </motion.div>
            );
          })}
        </section>

        {visibleCount < totalProducts && (
          <div ref={loaderRef} className="bottom-loader">
            {loadingMore ? <p>Loading more products...</p> : <p>Scroll to load more</p>}
          </div>
        )}

        {visibleCount >= totalProducts && totalProducts > 0 && (
          <div className="end-message">No more products</div>
        )}

        {totalProducts === 0 && (
          <div className="end-message">No products found</div>
        )}
      </div>

      <LoginPopup
        show={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
      />

      <Footer />

      <style>{`
        .collection-container {
          padding: 40px 10%;
        }

        .page-title {
          font-size: 28px;
          margin-bottom: 10px;
        }

        .products-count {
          font-size: 14px;
          color: gray;
          margin-bottom: 20px;
        }

        .controls-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 25px;
          gap: 15px;
        }

        .controls-row input,
        .controls-row select {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 14px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 22px;
        }

        .product-card {
          border: 1px solid #eee;
          border-radius: 14px;
          padding: 15px;
          background: white;
          transition: 0.25s ease;
          position: relative;
        }

        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 25px rgba(0,0,0,0.08);
        }

        .product-card img {
          width: 100%;
          height: 220px;
          object-fit: contain;
          margin-bottom: 10px;
        }

        .card-icons {
          display: flex;
          justify-content: flex-end;
        }

        .wishlist-btn {
          border: none;
          background: transparent;
          font-size: 22px;
          cursor: pointer;
          color: gray;
          transition: 0.2s ease;
        }

        .wishlist-btn:hover {
          transform: scale(1.15);
        }

        .wishlist-btn.active {
          color: #e03131;
        }

        .price {
          font-weight: 600;
          margin: 5px 0 12px;
        }

        .cart-btn {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          border: none;
          background: black;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .cart-btn:hover {
          background: #333;
        }

        .bottom-loader,
        .end-message {
          text-align: center;
          padding: 30px;
          color: gray;
        }

        @media(max-width:768px){
          .collection-container {
            padding: 20px;
          }

          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
};

export default GoldCollection;
