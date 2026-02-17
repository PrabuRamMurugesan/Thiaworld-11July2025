import React, { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../../context/AuthContext";
import Header from "../Header";
import Footer from "../Footer";
import { IoHeart, IoStar } from "react-icons/io5";
import { useWishlist } from "../../context/WishlistContext";
import { IoMdHeart } from "react-icons/io";
import { PiHeart } from "react-icons/pi";
import {
  pickFirstImageSrc,
  normalizeImages,
  buildImgSrc,
} from "../../utils/imageTools";
import { IoEyeSharp } from "react-icons/io5";
import Navbar from "../Navbar";
import { motion } from "framer-motion";
import LoginPopup from "../LoginPopup";
// Same INR formatter style as ProductDetail page
function formatINR(n) {
  return Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const GoldCollection = () => {
  // raw products from API
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { isWished, toggle } = useWishlist();

  // track images that failed to load by product id
  const [imgErrors, setImgErrors] = useState({});

  const handleImageError = (id, e) => {
    // hide the broken image element if provided
    try {
      if (e && e.target) e.target.style.display = "none";
    } catch (err) {
      // ignore
    }
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  // filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState([]); // ["Bangles","Chains","Rings"]
  const [purityFilter, setPurityFilter] = useState([]); // ["18K","22K","24K"]
  const [sortOption, setSortOption] = useState(""); // "", "newest", "priceAsc", "priceDesc"

  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Check if user is logged in
  const isLoggedIn = () => {
    try {
      const stored = localStorage.getItem("bbsUser");
      return stored && JSON.parse(stored)?.token;
    } catch {
      return false;
    }
  };

  // Handle add to cart with login check
  const handleAddToCart = (product) => {
    if (!isLoggedIn()) {
      setShowLoginPopup(true);
      return;
    }
    addToCart(product);
  };

  // Handle wishlist toggle with login check
  const handleWishlistToggle = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn()) {
      setShowLoginPopup(true);
      return;
    }
    toggle(productId);
  };

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);
  // fetch once
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URI}/products/gold`,
        );
        const data = Array.isArray(res.data) ? res.data : res.data.items || [];
        setAllProducts(data || []);
      } catch (err) {
        console.error("Error fetching gold products:", err?.message || err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // purity normalizer: "18", "18k", "18KT" -> "18K"
  const normPurity = (v) => {
    if (v == null) return "";
    const s = String(v).toUpperCase().replace(/\s+/g, "");
    const m = s.match(/^(\d{2})(K|KT)?$/);
    if (m) return `${m[1]}K`;
    return s.endsWith("KT") ? s.slice(0, -1) : s;
  };

  // derived list
  const filteredSorted = useMemo(() => {
    let list = allProducts.slice();

    const q = search.trim().toLowerCase();
    if (q)
      list = list.filter((p) =>
        String(p.name || "")
          .toLowerCase()
          .includes(q),
      );

    if (categoryFilter.length) {
      const cats = new Set(categoryFilter.map((c) => c.toLowerCase()));
      list = list.filter((p) =>
        cats.has(String(p.category || "").toLowerCase()),
      );
    }

    if (purityFilter.length) {
      const want = new Set(purityFilter.map(normPurity));
      list = list.filter((p) => want.has(normPurity(p.purity)));
    }

    if (sortOption === "newest") {
      list.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    } else if (sortOption === "priceAsc") {
      list.sort(
        (a, b) =>
          Number(
            a.displaySale || a.displayPrice || a.displayActual || a.price || 0,
          ) -
          Number(
            b.displaySale || b.displayPrice || b.displayActual || b.price || 0,
          ),
      );
    } else if (sortOption === "priceDesc") {
      list.sort(
        (a, b) =>
          Number(
            b.displaySale || b.displayPrice || b.displayActual || b.price || 0,
          ) -
          Number(
            a.displaySale || a.displayPrice || a.displayActual || a.price || 0,
          ),
      );
    }

    return list;
  }, [allProducts, search, categoryFilter, purityFilter, sortOption]);

  useEffect(
    () => setCurrentPage(1),
    [search, categoryFilter, purityFilter, sortOption],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSorted.length / itemsPerPage),
  );
  const paginatedProducts = filteredSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const toggleCategory = (cat) => {
    setCategoryFilter((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const togglePurity = (p) => {
    setPurityFilter((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  };

  // numbered pagination helpers
  const maxVisiblePages = 5;
  const visiblePages = useMemo(() => {
    const pages = [];
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = start + maxVisiblePages - 1;
    if (end > totalPages) {
      end = totalPages;
      start = totalPages - maxVisiblePages + 1;
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [totalPages, currentPage]);

  const handlePageClick = (p) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  if (loading) return <p className="text-center my-8">Loading...</p>;
  if (error) return <p className="text-center text-danger my-8">{error}</p>;

  return (
    <>
      <Header />
      <Navbar />
      <div className="container-fluid mt-5" style={{ padding: "0 10%" }}>
        {/* Breadcrumb */}
        <div className="text-sm text-muted mb-2">
          <Link to="/" className="text-black-600 hover:no-underline">
            Home
          </Link>
          <span className="mx-2">›</span>
          <span className="text-yellow-600">Gold Collection</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-yellow-700 mb-3">
          Gold Collection
        </h1>

        {/* Top row: search + sort */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
          <div
            className="d-flex align-items-center border border-gray-300 rounded px-2"
            style={{ minWidth: 260 }}
          >
            <input
              type="text"
              placeholder="Search gold..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-2 py-1 outline-none text-sm w-100"
            />
          </div>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            style={{ minWidth: 160 }}
          >
            <option value="">Sort by</option>
            <option value="newest">New Arrivals</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>

        {/* Inline filters row just under Sort */}
        <div className="d-flex flex-wrap align-items-center gap-4 mb-4">
          <div className="d-flex flex-wrap align-items-center gap-3">
            <span className="fw-bold me-2">Category:</span>
            {["Bangles", "Chains", "Rings"].map((cat) => (
              <label
                key={cat}
                className="d-flex align-items-center gap-1 text-sm"
              >
                <input
                  type="checkbox"
                  checked={categoryFilter.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                {cat}
              </label>
            ))}
          </div>

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
            }
            return (
              <motion.div
                key={prod._id}
                className="position-relative  p-3"
                style={{ width: 260 }}
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
                <div
                  key={prod._id}
                  className="position-relative border rounded p-3"
                  style={{ width: 260 }}
                >
                  <div
                    className="d-flex justify-content-between position-absolute top-0 start-0 end-0 px-4 mt-4"
                    style={{ zIndex: 1 }}
                  >
                    <IoStar style={{ color: "white", fontSize: 20 }} />
                    <button
                      aria-label="Toggle wishlist"
                      onClick={(e) => handleWishlistToggle(prod._id, e)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                      title={
                        isWished(prod._id)
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      {isWished(prod._id) ? (
                        <IoMdHeart
                          style={{
                            fontSize: 25,
                            color: "#e03131",
                            transition: "color 120ms ease",
                          }}
                        />
                      ) : (
                        <PiHeart
                          style={{
                            fontSize: 25,
                            color: "gray",
                            transition: "color 120ms ease",
                          }}
                        />
                      )}
                    </button>
                  </div>

                  <Link to={`/product/${prod._id}`}>
                    {!imgErrors[prod._id] ? (
                      <img
                      
                        src={buildImgSrc(firstImg)}
                        alt={prod.name}
                        style={{
                          width: "100%",
                          height: 300,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        onError={(e) => handleImageError(prod._id, e)}
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
                  </Link>
                  <div className="d-flex justify-content-end align-items-center">
                    {" "}
                    <button
                      onClick={() =>
                        (window.location.href = "/virtual-jewelry-on")
                      }
                      className="text-xs text-nowrap  flex flex-row gap-2 items-center py-1 px-2 rounded bg-yellow-100 hover:bg-yellow-200 transition"
                    >
                      <IoEyeSharp size={15} color="brown" /> Try This On
                    </button>
                  </div>
                  <div className="mt-2">
                    <div className="flex gap-2 justify-between items-center">
                      <div>
                        <h3 className="text-gray-800 mt-2 text-nowrap">
                          {prod.name}
                        </h3>
                        <p className="text-xs text-gray-500 my-2">
                          Net: {prod.netWeight}g | Gross: {prod.grossWeight}g
                        </p>
                      </div>
                    </div>

                    <div className="mt-1 text-yellow-700 fw-bold ">
                      ₹{formatINR(payableBase)}
                      {strike && (
                        <span className="text-gray-400 text-decoration-line-through ms-2">
                          ₹{formatINR(strike)}
                        </span>
                      )}
                      {/* <span className="text-gray-400 text-decoration-line-through ms-2">
                        ₹{formatINR(strike)}
                      </span> */}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <Link
                      to={`/product/${prod._id}`}
                      className="btn button-90 btn-sm fw-bold px-4 text-xs"
                    >
                      View
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(prod);
                      }}
                      className="btn button-90 btn-sm fw-bold px-4 text-xs text-nowrap"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>
        <LoginPopup
          show={showLoginPopup}
          onClose={() => setShowLoginPopup(false)}
        />

        {/* Pagination: numbered controls with ellipses */}
        {totalPages > 1 && (
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
      </div>

      <Footer />
      <style>
        {`
  .button-90 {
  background-image: linear-gradient(#0dccea, #0d70ea);
  border: 0;
  border-radius: 40px;
  box-shadow: rgba(0, 0, 0, .3) 0 5px 15px;
  box-sizing: border-box;
  color: #fff;            /* normal color white */
  cursor: pointer;
  font-family: Montserrat, sans-serif;
  font-size: .9em;
  margin: 5px;
  padding: 10px 15px;
  text-align: center;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

/* hover fixed (must be outside the class) */
.button-90:hover {
  color: #D7F5D1!important;  /* hover color red */
}

        `}
      </style>
    </>
  );
};

export default GoldCollection;
