import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFilter, FaTimes, FaSlidersH } from "react-icons/fa";

const AdvancedSearch = ({ onSearch, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    metalType: "",
    priceRange: { min: "", max: "" },
    weightRange: { min: "", max: "" },
    inStock: false,
    onSale: false,
    sortBy: "relevance"
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "Necklace",
    "Bangle",
    "Earring",
    "Chain",
    "Ring",
    "Pendant"
  ];

  const metalTypes = [
    "22K Gold",
    "18K Gold",
    "Rose Gold",
    "White Gold",
    "Silver",
    "Platinum",
    "Diamond"
  ];

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
    { value: "popular", label: "Most Popular" },
    { value: "rating", label: "Highest Rated" }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePriceRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value
      }
    }));
  };

  const handleWeightRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      weightRange: {
        ...prev.weightRange,
        [type]: value
      }
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    
    if (searchTerm) searchParams.set("q", searchTerm);
    if (filters.category) searchParams.set("category", filters.category);
    if (filters.metalType) searchParams.set("metalType", filters.metalType);
    if (filters.priceRange.min) searchParams.set("minPrice", filters.priceRange.min);
    if (filters.priceRange.max) searchParams.set("maxPrice", filters.priceRange.max);
    if (filters.weightRange.min) searchParams.set("minWeight", filters.weightRange.min);
    if (filters.weightRange.max) searchParams.set("maxWeight", filters.weightRange.max);
    if (filters.inStock) searchParams.set("inStock", "true");
    if (filters.onSale) searchParams.set("onSale", "true");
    if (filters.sortBy) searchParams.set("sort", filters.sortBy);

    navigate(`/search?${searchParams.toString()}`);
    if (onSearch) onSearch(searchParams);
    if (onClose) onClose();
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      metalType: "",
      priceRange: { min: "", max: "" },
      weightRange: { min: "", max: "" },
      inStock: false,
      onSale: false,
      sortBy: "relevance"
    });
    setSearchTerm("");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Advanced Search</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSearch}>
        {/* Search Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for jewelry..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4c542]"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Toggle Filters */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-[#f4c542] font-medium mb-4 hover:underline"
        >
          <FaSlidersH />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {showFilters && (
          <div className="space-y-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4c542]"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Metal Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metal Type
              </label>
              <select
                value={filters.metalType}
                onChange={(e) => handleFilterChange("metalType", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4c542]"
              >
                <option value="">All Metals</option>
                {metalTypes.map((metal) => (
                  <option key={metal} value={metal}>
                    {metal}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range (₹)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceRangeChange("min", e.target.value)}
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4c542]"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceRangeChange("max", e.target.value)}
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4c542]"
                />
              </div>
            </div>

            {/* Weight Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight Range (grams)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.weightRange.min}
                  onChange={(e) => handleWeightRangeChange("min", e.target.value)}
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4c542]"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.weightRange.max}
                  onChange={(e) => handleWeightRangeChange("max", e.target.value)}
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4c542]"
                />
              </div>
            </div>

            {/* Checkbox Filters */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => handleFilterChange("inStock", e.target.checked)}
                  className="w-4 h-4 text-[#f4c542]"
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.onSale}
                  onChange={(e) => handleFilterChange("onSale", e.target.checked)}
                  className="w-4 h-4 text-[#f4c542]"
                />
                <span className="text-sm text-gray-700">On Sale</span>
              </label>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f4c542]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="flex-1 bg-[#0B0B0B] text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            <FaSearch className="inline mr-2" />
            Search
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdvancedSearch;
