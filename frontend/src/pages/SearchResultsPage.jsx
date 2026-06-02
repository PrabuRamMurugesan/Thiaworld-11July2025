import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import AdvancedSearch from "../components/AdvancedSearch";
import ProductCard from "../components/ProductCard";
import { FaFilter, FaTh, FaList } from "react-icons/fa";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchParams.get("q")) params.search = searchParams.get("q");
      if (searchParams.get("category")) params.category = searchParams.get("category");
      if (searchParams.get("metalType")) params.metalType = searchParams.get("metalType");
      if (searchParams.get("minPrice")) params.minPrice = searchParams.get("minPrice");
      if (searchParams.get("maxPrice")) params.maxPrice = searchParams.get("maxPrice");
      if (searchParams.get("minWeight")) params.minWeight = searchParams.get("minWeight");
      if (searchParams.get("maxWeight")) params.maxWeight = searchParams.get("maxWeight");
      if (searchParams.get("inStock")) params.inStock = searchParams.get("inStock");
      if (searchParams.get("onSale")) params.onSale = searchParams.get("onSale");
      if (searchParams.get("sort")) params.sort = searchParams.get("sort");

      const response = await axios.get(`${import.meta.env.VITE_API_URI}/products/search`, {
        params
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getSearchSummary = () => {
    const parts = [];
    if (searchParams.get("q")) parts.push(`"${searchParams.get("q")}"`);
    if (searchParams.get("category")) parts.push(searchParams.get("category"));
    if (searchParams.get("metalType")) parts.push(searchParams.get("metalType"));
    return parts.join(" in ");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {searchParams.get("q") ? `Search Results for "${searchParams.get("q")}"` : "All Products"}
              </h1>
              <p className="text-gray-600">
                {products.length} {products.length === 1 ? "product" : "products"} found
                {getSearchSummary() && ` in ${getSearchSummary()}`}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSearchModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FaFilter />
                Filters
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid" ? "bg-[#f4c542] text-white" : "bg-white border"
                  }`}
                >
                  <FaTh />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list" ? "bg-[#f4c542] text-white" : "bg-white border"
                  }`}
                >
                  <FaList />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {searchParams.get("category") && (
              <span className="px-3 py-1 bg-[#f4c542] text-white rounded-full text-sm">
                Category: {searchParams.get("category")}
              </span>
            )}
            {searchParams.get("metalType") && (
              <span className="px-3 py-1 bg-[#f4c542] text-white rounded-full text-sm">
                Metal: {searchParams.get("metalType")}
              </span>
            )}
            {(searchParams.get("minPrice") || searchParams.get("maxPrice")) && (
              <span className="px-3 py-1 bg-[#f4c542] text-white rounded-full text-sm">
                Price: ₹{searchParams.get("minPrice") || "0"} - ₹{searchParams.get("maxPrice") || "∞"}
              </span>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4c542] mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching products...</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <div
              className={`${
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20 sm:pb-6"
                  : "space-y-4"
              }`}
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} viewMode={viewMode} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search filters or browse our categories
              </p>
              <button
                onClick={() => setShowSearchModal(true)}
                className="px-6 py-2 bg-[#f4c542] text-white rounded-lg hover:bg-[#caa43b]"
              >
                Modify Search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <AdvancedSearch
              onSearch={() => {
                setShowSearchModal(false);
                fetchProducts();
              }}
              onClose={() => setShowSearchModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SearchResultsPage;
