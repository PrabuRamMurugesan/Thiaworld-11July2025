import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import Header from "../Header";
import Footer from "../Footer";
import { IoHeart, IoStar } from "react-icons/io5";
import api from "../../utils/api";
const GoldCollection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [purityFilter, setPurityFilter] = useState([]);
  const [sortOption, setSortOption] = useState("");

  const { addToCart } = useContext(CartContext);

  // ✅ Pagination States - moved to top level
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchGoldProducts();
  }, [search, categoryFilter, purityFilter, sortOption]);

  const fetchGoldProducts = async () => {
    try {
      const query = [];

      if (search) query.push(`name=${encodeURIComponent(search)}`);
      if (categoryFilter.length)
        query.push(`category=${categoryFilter.join(",")}`);
      if (purityFilter.length) query.push(`purity=${purityFilter.join(",")}`);
      if (sortOption) {
        if (sortOption === "Price: Low to High")
          query.push("sort=priceLowHigh");
        else if (sortOption === "Price: High to Low")
          query.push("sort=priceHighLow");
        else if (sortOption === "New Arrivals") query.push("sort=newest");
      }

      // ✅ Build query string correctly
      const queryString = query.length ? `?${query.join("&")}` : "";

      // ✅ Always use leading slash for axios baseURL
      // const res = await api.get(`/products/gold${queryString}`);
      const res = await api.get(`products/gold${queryString}`);
      setProducts(res.data);
      setLoading(false);
      setCurrentPage(1);
    } catch (err) {
      console.error("❌ Error fetching gold products:", err.message || err);
      setError("Failed to load products.");
      setLoading(false);
    }
  };

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p className="text-center my-8">Loading...</p>;
  if (error) return <p className="text-center text-danger my-8">{error}</p>;

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
          Home / Jewellery /{" "}
          <span className="text-yellow-600">Gold Collection</span>
        </div>

        {/* Header */}
        <div
          className="d-flex justify-between align-items-center my-4 mb-5"
          style={{ padding: "0 10%" }}
        >
          <h1 className="text-2xl font-bold text-yellow-700">
            Gold Collection
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="flex items-center border border-gray-300 rounded-md px-2">
              <input
                type="text"
                placeholder="Search gold..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-2 py-1 outline-none text-sm"
              />
            </div>

            {/* Sort */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              <option>Sort by</option>
              <option>New Arrivals</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        <aside className="mb-4">
          <div
            className="bg-gray-50 border-gray-200 shadow-sm d-flex flex-row align-items-center justify-around flex-wrap gap-4"
            style={{ fontFamily: "'Times New Roman', serif" }}
          >
            <h3 className="text-lg m-0 me-3 font-bold font-serif">Filters:</h3>

            {/* Category */}
            <div className="d-flex flex-row align-items-center gap-2">
              <h4 className="m-0 text-gray-700 font-semibold">Category :</h4>
              <div className="d-flex flex-row gap-3 text-gray-600">
                {["Bangles", "Chains", "Rings"].map((cat) => (
                  <label key={cat} className="d-flex align-items-center gap-1">
                    <input
                      type="checkbox"
                      checked={categoryFilter.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Purity */}
            <div className="d-flex flex-row align-items-center gap-2">
              <h4 className="m-0 text-gray-700 font-semibold">Purity :</h4>
              <div className="d-flex flex-row gap-3 text-gray-600">
                {["18K", "22K", "24K"].map((purity) => (
                  <label
                    key={purity}
                    className="d-flex align-items-center gap-1"
                  >
                    <input
                      type="checkbox"
                      checked={purityFilter.includes(purity)}
                      onChange={() => togglePurity(purity)}
                    />
                    {purity}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
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
                    `http://localhost:5000${prod.images?.[0]}` ||
                    "/default-product.jpg"
                  }
                  alt={prod.name}
                  style={{ width: "250px", height: "250px" }}
                />
              </Link>

              <div className="mt-2">
                <h3 className="text-gray-800 mt-2">{prod.name}</h3>
                <p className="text-xs text-gray-500 my-2">
                  Net: {prod.netWeight}g | Gross: {prod.grossWeight}g
                </p>
                <div className="mt-1 text-yellow-700 font-bold text-md">
                  ₹{prod.price}{" "}
                  {prod.discount > 0 && (
                    <span className="text-gray-400 line-through text-sm ml-1">
                      ₹{Math.round(prod.price / (1 - prod.discount / 100))}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {prod.isSecurePlanEnabled && (
                  <div className="text-xs mt-1 inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    Secure Plan
                  </div>
                )}
                {prod.isPartialPaymentEnabled && (
                  <div className="text-xs mt-1 inline-block bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full ml-1">
                    Partial Pay
                  </div>
                )}
                {prod.isCombo && (
                  <div className="text-xs mt-1 inline-block bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full ml-1">
                    Combo
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => (window.location.href = "/virtual-try-on")}
                    className="flex-1 text-xs text-pink-600 border border-pink-600 rounded px-2 py-1 hover:bg-pink-50"
                  >
                    👁 Try This On
                  </button>
                  <button
                    onClick={() => addToCart(prod)}
                    className="flex-1 text-xs bg-yellow-500 text-white rounded px-2 py-1 hover:bg-yellow-600"
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Pagination Controls */}
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

export default GoldCollection;
