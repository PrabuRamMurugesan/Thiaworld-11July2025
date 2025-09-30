import React, { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import Header from "../Header";
import Footer from "../Footer";
import { IoHeart, IoStar } from "react-icons/io5";

const SilverCollection = () => {
  // Raw list from API
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState([]); // ["Bracelets","Pooja Items","Coins"]
  const [purityFilter, setPurityFilter] = useState([]); // ["800","900","925"]
  const [sortOption, setSortOption] = useState(""); // "", "newest", "priceAsc", "priceDesc"

  // Pagination (kept as in your file)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { addToCart } = useContext(CartContext);

  // Fetch once (no query params; we filter/sort locally)
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URI}/products/silver`
        );
        // accept either raw array or {items: [...]}
        const data = Array.isArray(res.data) ? res.data : res.data.items || [];
        setAllProducts(data || []);
      } catch (err) {
        console.error("❌ Error fetching silver products:", err);
        setError("Failed to load silver products.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Normalize silver purity (e.g., "925 " -> "925")
  const normPurity = (v) => String(v || "").trim();

  // Compute filtered+sorted list
  const filteredSorted = useMemo(() => {
    let list = allProducts.slice();

    // search by name
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        String(p.name || "")
          .toLowerCase()
          .includes(q)
      );
    }

    // category (case-insensitive)
    if (categoryFilter.length) {
      const cats = new Set(categoryFilter.map((c) => c.toLowerCase()));
      list = list.filter((p) =>
        cats.has(String(p.category || "").toLowerCase())
      );
    }

    // purity (800/900/925)
    if (purityFilter.length) {
      const want = new Set(purityFilter.map(normPurity));
      list = list.filter((p) => want.has(normPurity(p.purity)));
    }

    // sort
    if (sortOption === "newest") {
      list.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    } else if (sortOption === "priceAsc") {
      list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortOption === "priceDesc") {
      list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    return list;
  }, [allProducts, search, categoryFilter, purityFilter, sortOption]);

  // Reset page when filters/sort/search change
  useEffect(
    () => setCurrentPage(1),
    [search, categoryFilter, purityFilter, sortOption]
  );

  // Pagination slice
  const totalPages = Math.max(
    1,
    Math.ceil(filteredSorted.length / itemsPerPage)
  );
  const paginatedProducts = filteredSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // UI helpers (kept behavior)
  const toggleCategory = (cat) => {
    setCategoryFilter((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };
  const togglePurity = (purity) => {
    setPurityFilter((prev) =>
      prev.includes(purity)
        ? prev.filter((p) => p !== purity)
        : [...prev, purity]
    );
  };
  const handlePageChange = (page) => setCurrentPage(page);

  if (loading) return <p className="text-center my-8">Loading...</p>;
  if (error) return <p className="text-center text-red-500 my-8">{error}</p>;

  return (
    <>
      <Header />

      <div className="bg-white min-h-screen">
        {/* Breadcrumb */}
        <div
          className="text-gray-500 mb-2"
          style={{
            backgroundColor: "#f9f9f9",
            padding: "20px 8%",
            color: "black",
            fontFamily: "'Times New Roman', Times, serif",
          }}
        >
          <div className="text-sm text-muted mb-2">
            <Link to="/" className="text-black-600 hover:no-underline">
              Home
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-400">Silver Collection</span>
          </div>
        </div>

        {/* Title + Search + Sort (same layout as Gold) */}
        <div
          className="d-flex justify-between align-items-center my-4 mb-3"
          style={{ padding: "0 10%" }}
        >
          <h1 className="text-2xl font-bold text-gray-700 m-0">
            Silver Collection
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="flex items-center border border-gray-300 rounded-md px-2">
              <input
                type="text"
                placeholder="Search silver..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-2 py-1 outline-none text-sm"
              />
            </div>

            {/* Sort (explicit values) */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              <option value="">Sort by</option>
              <option value="newest">New Arrivals</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Inline filters row just under Sort (like your Silver mock + Gold page) */}
        <div
          className="d-flex flex-wrap align-items-center gap-4 mb-4"
          style={{ padding: "0 10%" }}
        >
          {/* Category */}
          <div className="d-flex flex-wrap align-items-center gap-3">
            <span className="fw-bold me-2">Category:</span>
            {["Bracelets", "Pooja Items", "Coins"].map((cat) => (
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

          {/* Purity */}
          <div className="d-flex flex-wrap align-items-center gap-3">
            <span className="fw-bold me-2">Purity:</span>
            {["800", "900", "925"].map((p) => (
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

        {/* Product Grid (kept your card, tags, and image logic) */}
        <section className="d-flex flex-row flex-wrap justify-start gap-4 p-4 m-5">
          {paginatedProducts.map((prod) => (
            <div
              key={prod._id}
              className="border rounded shadow-sm bg-white hover:shadow-md transition duration-200 position-relative p-5"
              style={{
                width: "350px",
                height: "500px",
                border: "1px solid gray",
                borderRadius: "15px",
                backgroundColor: "#f9f9f9",
                boxShadow: "rgba(0, 0, 1, 0.5) 0px 3px 8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "start",
                position: "relative",
              }}
            >
              <div
                className="d-flex justify-content-between position-absolute top-0 start-0 end-0 px-4 mt-4"
                style={{ zIndex: "1" }}
              >
                <IoStar style={{ color: "gray", fontSize: "25px" }} />
                <IoHeart style={{ color: "gray", fontSize: "25px" }} />
              </div>

              <Link to={`/product/${prod._id}`}>
                <img
                  src={
                    (prod.images?.[0]?.startsWith("http")
                      ? prod.images[0]
                      : `${import.meta.env.VITE_API_URI}${
                          prod.images?.[0] || ""
                        }`) || "/default-product.jpg"
                  }
                  alt={prod.name}
                  style={{
                    width: "250px",
                    height: "250px",
                    objectFit: "cover",
                  }}
                />
              </Link>

              <div className="mt-2 w-100 text-center">
                <h3 className="my-2 font-medium text-gray-800">{prod.name}</h3>
                <p className="my-2 text-gray-500">
                  Net: {prod.netWeight}g | Gross: {prod.grossWeight}g
                </p>

                <div className="mt-1 text-yellow-700 font-bold text-md">
                  ₹{Number(prod.price || 0).toLocaleString("en-IN")}{" "}
                  {Number(prod.discount || 0) > 0 && (
                    <span className="text-gray-400 line-through text-sm ms-1">
                      ₹
                      {Number(
                        Math.round(
                          (prod.price || 0) / (1 - (prod.discount || 0) / 100)
                        )
                      ).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {/* Tags (kept) */}
                {prod.isSecurePlanEnabled && (
                  <div className="mt-1 d-inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded-pill">
                    Secure Plan
                  </div>
                )}
                {prod.isPartialPaymentEnabled && (
                  <div className="mt-1 d-inline-block bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-pill ms-1">
                    Partial Pay
                  </div>
                )}
                {prod.isCombo && (
                  <div className="mt-1 d-inline-block bg-purple-100 text-purple-800 px-2 py-0.5 rounded-pill ms-1">
                    Combo
                  </div>
                )}

                <div className="mt-3 d-flex gap-2 justify-content-center">
                  <button
                    onClick={() => (window.location.href = "/virtual-try-on")}
                    className="text-xs text-pink-600 border border-pink-600 rounded px-2 py-1 hover:bg-pink-50"
                  >
                    👁 Try This On
                  </button>
                  <button
                    onClick={() => addToCart(prod)}
                    className="text-xs bg-yellow-500 text-white rounded px-2 py-1 hover:bg-yellow-600"
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Pagination Controls (same behavior) */}
        <div className="d-flex justify-content-center my-4 gap-2 align-items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="filter-btn"
            style={{
              background: currentPage === 1 ? "#ddd" : "#ffe08a",
              color: "#333",
              padding: "10px 20px",
              borderRadius: "30px",
              fontWeight: "bold",
              marginRight: "10px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`filter-btn ${
                currentPage === index + 1 ? "active" : ""
              }`}
              style={{ width: "45px", height: "45px", fontWeight: "bold" }}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="filter-btn"
            style={{
              background: currentPage === totalPages ? "#ddd" : "#ffb703",
              color: "#333",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: "30px",
              marginLeft: "10px",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SilverCollection;
