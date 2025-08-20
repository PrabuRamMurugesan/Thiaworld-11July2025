// ✅ src/pages/ProductList.jsx

import React, { useEffect, useState, useContext } from "react";
import { FaFilter, FaSearch, FaThList, FaTh } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const ProductList = () => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [gridView, setGridView] = useState(true);
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [purityFilter, setPurityFilter] = useState([]);
  const [sortOption, setSortOption] = useState("");

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter, purityFilter, sortOption]);

  const fetchProducts = async () => {
    try {
      let query = [];

      if (search) query.push(`name=${encodeURIComponent(search)}`);
      if (categoryFilter.length)
        query.push(`category=${categoryFilter.join(",")}`);
      if (purityFilter.length) query.push(`purity=${purityFilter.join(",")}`);
      if (sortOption) {
        if (sortOption === "Price: Low to High")
          query.push("sort=priceLowHigh");
        if (sortOption === "Price: High to Low")
          query.push("sort=priceHighLow");
        if (sortOption === "New Arrivals") query.push("sort=newest");
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URI}/products/all${query.join("&")}`
      );

      setProducts(res.data);
    } catch (err) {
      console.error(err);
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

  // ✅ Normalize: ensure .category always exists
  const normalizedProducts = products.map((prod) => ({
    ...prod,
    category: prod.category || prod.metalType,
  }));

  // ✅ Split into Gold & Silver
  const goldProducts = normalizedProducts.filter((p) => p.category === "Gold");
  const silverProducts = normalizedProducts.filter(
    (p) => p.category === "Silver"
  );
  const diamondProducts = normalizedProducts.filter(
    (p) => p.category === "Diamond"
  );
  const platinumProducts = normalizedProducts.filter(
    (p) => p.category === "Platinum"
  );

  return (
    <div className="bg-white min-h-screen p-4">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2">
        Home / Jewellery /{" "}
        <span className="text-yellow-600 font-medium">Products</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Jewellery</h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex items-center border border-gray-300 rounded-md px-2">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search jewelry..."
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

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setGridView(true)}
              className={`${gridView ? "text-yellow-600" : "text-gray-500"}`}
            >
              <FaTh />
            </button>
            <button
              onClick={() => setGridView(false)}
              className={`${!gridView ? "text-yellow-600" : "text-gray-500"}`}
            >
              <FaThList />
            </button>
          </div>

          {/* Mobile Filter */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden text-yellow-600"
          >
            <FaFilter /> Filters
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside
          className={`md:block ${
            mobileFilterOpen ? "block" : "hidden"
          } md:w-1/4`}
        >
          <div className="bg-gray-50 p-4 rounded border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>

            {/* Category */}
            <div className="mb-4">
              <h4 className="font-medium mb-2 text-gray-700">Category</h4>
              <div className="space-y-1 text-sm text-gray-600">
                {["Bangles", "Chains", "Rings"].map((cat) => (
                  <label key={cat}>
                    <input
                      type="checkbox"
                      checked={categoryFilter.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />{" "}
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Purity */}
            <div className="mb-4">
              <h4 className="font-medium mb-2 text-gray-700">Purity</h4>
              <div className="space-y-1 text-sm text-gray-600">
                {["18K", "22K", "24K"].map((purity) => (
                  <label key={purity}>
                    <input
                      type="checkbox"
                      checked={purityFilter.includes(purity)}
                      onChange={() => togglePurity(purity)}
                    />{" "}
                    {purity}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ✅ Product Grid */}
        <div className="flex-1">
          {/* Gold Section */}
          <h2 className="text-xl font-bold mb-4 text-yellow-700">
            Gold Products
          </h2>
          {goldProducts.length === 0 ? (
            <p>No Gold products found.</p>
          ) : (
            <section className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mb-10">
              {goldProducts.map((prod) => (
                <ProductCard key={prod._id} prod={prod} addToCart={addToCart} />
              ))}
            </section>
          )}

          {/* Silver Section */}
          <h2 className="text-xl font-bold mb-4 text-gray-500">
            Silver Products
          </h2>
          {silverProducts.length === 0 ? (
            <p>No Silver products found.</p>
          ) : (
            <section className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {silverProducts.map((prod) => (
                <ProductCard key={prod._id} prod={prod} addToCart={addToCart} />
              ))}
            </section>
          )}
          {/* Silver Section */}
          <h2 className="text-xl font-bold mb-4 text-gray-500">Platinum</h2>
          {platinumProducts.length === 0 ? (
            <p>No Silver products found.</p>
          ) : (
            <section className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {platinumProducts.map((prod) => (
                <ProductCard key={prod._id} prod={prod} addToCart={addToCart} />
              ))}
            </section>
          )}
          {/* Silver Section */}
          <h2 className="text-xl font-bold mb-4 text-gray-500">Diamond</h2>
          {diamondProducts.length === 0 ? (
            <p>No Silver products found.</p>
          ) : (
            <section className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {diamondProducts.map((prod) => (
                <ProductCard key={prod._id} prod={prod} addToCart={addToCart} />
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ Reusable Product Card
const ProductCard = ({ prod, addToCart }) => (
  <div className="border rounded shadow-sm p-3 bg-white hover:shadow-md transition duration-200">
    <div className="w-full h-48 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
      <Link to={`/product/${prod._id}`}>
        <img
          src={prod.images[0]}
          alt={prod.name}
          className="object-cover h-full w-full"
        />
      </Link>
    </div>
    <div className="mt-2">
      <h3 className="text-sm font-medium text-gray-800">{prod.name}</h3>
      <p className="text-xs text-gray-500">
        Net Wt: {prod.netWeight}g | Gross: {prod.grossWeight}g
      </p>
      <div className="mt-1 text-yellow-700 font-bold text-md">
        ₹{prod.price}{" "}
        {prod.discount > 0 && (
          <span className="text-gray-400 line-through text-sm">
            ₹{Math.round(prod.price / (1 - prod.discount / 100))}
          </span>
        )}
      </div>
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
      <div className="mt-2 flex gap-2">
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
);

export default ProductList;
