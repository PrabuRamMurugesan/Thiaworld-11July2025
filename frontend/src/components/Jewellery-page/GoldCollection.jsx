import React, { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import Header from "../Header";
import Footer from "../Footer";
import { IoHeart, IoStar } from "react-icons/io5";

const GoldCollection = () => {
  // raw products from API
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState([]); // ["Bangles","Chains","Rings"]
  const [purityFilter, setPurityFilter] = useState([]); // ["18K","22K","24K"]
  const [sortOption, setSortOption] = useState(""); // "", "newest", "priceAsc", "priceDesc"

  const { addToCart } = useContext(CartContext);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // fetch once
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URI}/products/gold`
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
          .includes(q)
      );

    if (categoryFilter.length) {
      const cats = new Set(categoryFilter.map((c) => c.toLowerCase()));
      list = list.filter((p) =>
        cats.has(String(p.category || "").toLowerCase())
      );
    }

    if (purityFilter.length) {
      const want = new Set(purityFilter.map(normPurity));
      list = list.filter((p) => want.has(normPurity(p.purity)));
    }

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

  useEffect(
    () => setCurrentPage(1),
    [search, categoryFilter, purityFilter, sortOption]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSorted.length / itemsPerPage)
  );
  const paginatedProducts = filteredSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleCategory = (cat) => {
    setCategoryFilter((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const togglePurity = (p) => {
    setPurityFilter((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  if (loading) return <p className="text-center my-8">Loading...</p>;
  if (error) return <p className="text-center text-danger my-8">{error}</p>;

  return (
    <>
      <Header />

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

        {/* Inline filters row just under Sort (like Silver page) */}
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
          {paginatedProducts.map((prod) => (
            <div
              key={prod._id}
              className="position-relative border rounded p-3"
              style={{ width: 270 }}
            >
              <div
                className="d-flex justify-content-between position-absolute top-0 start-0 end-0 px-4 mt-4"
                style={{ zIndex: 1 }}
              >
                <IoStar style={{ color: "gray", fontSize: 25 }} />
                <IoHeart style={{ color: "gray", fontSize: 25 }} />
              </div>

              <Link to={`/product/${prod._id}`}>
                <img
                  src={
                    prod.images?.[0] ? prod.images[0] : "/default-product.jpg"
                  }
                  alt={prod.name}
                  style={{ width: 250, height: 250, objectFit: "cover" }}
                />
              </Link>

              <div className="mt-2">
                <h3 className="text-gray-800 mt-2">{prod.name}</h3>
                <p className="text-xs text-gray-500 my-2">
                  Net: {prod.netWeight}g | Gross: {prod.grossWeight}g
                </p>

                <div className="mt-1 text-yellow-700 fw-bold">
                  ₹{Number(prod.price || 0).toLocaleString("en-IN")}
                  {Number(prod.discount || 0) > 0 && (
                    <span className="text-gray-400 text-decoration-line-through ms-2">
                      ₹{Number(prod.mrp || 0).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-between mt-3">
                <button
                  onClick={() => addToCart(prod)}
                  className="btn"
                  style={{
                    background: "#ffb703",
                    color: "#333",
                    fontWeight: "bold",
                    padding: "8px 16px",
                    borderRadius: 30,
                  }}
                >
                  Add to Cart
                </button>

                <Link
                  to={`/product/${prod._id}`}
                  className="btn"
                  style={{
                    background: "#f1f1f1",
                    color: "#333",
                    fontWeight: "bold",
                    padding: "8px 16px",
                    borderRadius: 30,
                  }}
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* Pagination */}
        <div className="d-flex justify-content-center align-items-center my-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="filter-btn"
            style={{
              background: currentPage === 1 ? "#ddd" : "#ffb703",
              color: "#333",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: 30,
              marginRight: 10,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            Prev
          </button>

          <span className="mx-2 fw-bold">
            {currentPage} /{" "}
            {Math.max(1, Math.ceil(filteredSorted.length / itemsPerPage))}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  Math.max(1, Math.ceil(filteredSorted.length / itemsPerPage)),
                  prev + 1
                )
              )
            }
            disabled={
              currentPage ===
              Math.max(1, Math.ceil(filteredSorted.length / itemsPerPage))
            }
            className="filter-btn"
            style={{
              background:
                currentPage ===
                Math.max(1, Math.ceil(filteredSorted.length / itemsPerPage))
                  ? "#ddd"
                  : "#ffb703",
              color: "#333",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: 30,
              marginLeft: 10,
              cursor:
                currentPage ===
                Math.max(1, Math.ceil(filteredSorted.length / itemsPerPage))
                  ? "not-allowed"
                  : "pointer",
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

export default GoldCollection;
