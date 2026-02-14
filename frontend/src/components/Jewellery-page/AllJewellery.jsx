import React, { useEffect, useState, useContext } from "react";
import Header from "../Header";
import axios from "axios";
import { IoMdArrowDropright } from "react-icons/io";
import { TiFilter } from "react-icons/ti";
import { CartContext } from "../../context/CartContext";
import { IoHeart, IoStar } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { normalizeImages, buildImgSrc } from "../../utils/imageTools";

const AllJewellery = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [purityFilter, setPurityFilter] = useState([]);
  const [metalFilter, setMetalFilter] = useState([]);
  const [genderFilter, setGenderFilter] = useState([]);
  const [occasionFilter, setOccasionFilter] = useState([]);
  const [tagsFilter, setTagsFilter] = useState([]);
  const [ready, setReady] = useState(false);

  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { isWished, toggle } = useWishlist();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const location = useLocation();

  // ======= READ URL SEARCH PARAMS =======
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keyword = params.get("search");
    if (keyword) setSearch(keyword);

    const tag = params.get("tags");
    const gender = params.get("gender");
    const occasion = params.get("occasion");

    if (tag) setTagsFilter([tag]);
    if (gender) setGenderFilter([gender]);
    if (occasion) setOccasionFilter([occasion]);

    setReady(true);
  }, [location.search]);

  // ======= FETCH PRODUCTS WHEN FILTERS CHANGE =======
  useEffect(() => {
    if (!ready) return;
    fetchAllJewellery();
  }, [
    ready,
    search,
    categoryFilter,
    purityFilter,
    metalFilter,
    sortOption,
    tagsFilter,
    genderFilter,
    occasionFilter,
  ]);

  const fetchAllJewellery = async () => {
    try {
      let query = [];

      if (categoryFilter.length)
        query.push(`category=${categoryFilter.join(",")}`);
      if (purityFilter.length) query.push(`purity=${purityFilter.join(",")}`);
      if (metalFilter.length) query.push(`metalType=${metalFilter.join(",")}`);
      if (tagsFilter.length) query.push(`tags=${tagsFilter.join(",")}`);
      if (genderFilter.length) query.push(`gender=${genderFilter.join(",")}`);
      if (occasionFilter.length)
        query.push(`occasion=${occasionFilter.join(",")}`);

      if (search) query.push(`search=${search}`);

      if (sortOption) {
        if (sortOption === "Price: Low to High")
          query.push("sort=priceLowToHigh");
        if (sortOption === "Price: High to Low")
          query.push("sort=priceHighToLow");
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URI}/products/all?${query.join("&")}`
      );

      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      setLoading(false);
    }
  };

  const toggleFilter = (type, value) => {
    const filterMap = {
      category: [categoryFilter, setCategoryFilter],
      purity: [purityFilter, setPurityFilter],
      metalType: [metalFilter, setMetalFilter],
      tags: [tagsFilter, setTagsFilter],
      gender: [genderFilter, setGenderFilter],
      occasion: [occasionFilter, setOccasionFilter],
    };

    const [filter, setFilter] = filterMap[type];

    setFilter(
      filter.includes(value)
        ? filter.filter((v) => v !== value)
        : [...filter, value]
    );
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ========= IMAGE RESOLVER ==========
  const resolveImage = (prod) => {
    try {
      const arr = normalizeImages(prod.images || []);
      if (arr.length === 0) return "/default-product.jpg";
      return buildImgSrc(arr[0]) || "/default-product.jpg";
    } catch (e) {
      return "/default-product.jpg";
    }
  };

  return (
    <>
      <Header />
      <div className="necklace-location">
        <span className="d-flex align-items-center" style={{ color: "black" }}>
          <Link to="/" className="text-black-600 hover:underline">
            Home
          </Link>
          <IoMdArrowDropright /> All Jewellery
        </span>
      </div>

      <div
        className="necklace-product-page d-flex justify-between align-items-center"
        style={{ padding: "0 0px 0 8%" }}
      >
        <h1>
          All Jewellery
          {occasionFilter.length > 0 && (
            <span className="ml-2 text-lg text-gray-700">
              - {occasionFilter.join(", ")} jewellery
            </span>
          )}
          {search && !occasionFilter.length && (
            <span className="ml-2 text-lg text-gray-700">- "{search}"</span>
          )}
          <span style={{ color: "black", fontSize: "18px", padding: "0 20px" }}>
            ({products.length} results)
          </span>
        </h1>

        <div className="necklace-product-filter">
          <input
            type="text"
            placeholder="Search jewellery..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid gray",
              width: "200px",
              height: "45px",
            }}
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid gray",
              height: "45px",
              width: "200px",
            }}
          >
            <option value="">Sort by</option>
            <option value="New Arrivals">New Arrivals</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="d-flex justify-center my-6 flex-wrap">
        {["Rings", "Chains", "Necklace", "Earrings"].map((cat) => (
          <button
            key={cat}
            onClick={() => toggleFilter("tags", cat)}
            className={`filter-btn ${tagsFilter.includes(cat) ? "active" : ""}`}
          >
            {cat}
          </button>
        ))}

        {["18K", "22K", "24K", "SI", "VVS", "95"].map((pur) => (
          <button
            key={pur}
            onClick={() => toggleFilter("purity", pur)}
            className={`filter-btn ${
              purityFilter.includes(pur) ? "active" : ""
            }`}
          >
            {pur}
          </button>
        ))}
        {["Gold", "Silver", "Diamond", "Platinum"].map((metal) => (
          <button
            key={metal}
            onClick={() => toggleFilter("metalType", metal)}
            className={`filter-btn ${
              metalFilter.includes(metal) ? "active" : ""
            }`}
          >
            {metal}
          </button>
        ))}
      </div>

      <div className="necklace-product-boxs">
        {loading ? (
          <p>Loading...</p>
        ) : paginatedProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
           paginatedProducts.map((prod) => {
            const img = resolveImage(prod);

            return (
              <Link
                to={`/product/${prod._id}`}
                key={prod._id}
                className="necklace-products-box"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="d-flex justify-content-between position-absolute top-0 start-0 end-0 px-4 mt-4">
                  <IoStar
                    className="sicon"
                    style={{ color: "#ffb703" }}
                  />

                  <IoHeart
                    onClick={(e) => { e.preventDefault(); toggle(prod._id); }}
                    className="sicon"
                    style={{ color: isWished(prod._id) ? "#e03131" : "gray", cursor: "pointer" }}
                  />
                </div>

                <img
                  src={img}
                  style={{
                    width: "250px",
                    height: "250px",
                    objectFit: "contain",
                  }}
                  alt={prod.name}
                  // onError={(e) => (e.target.src = "/default-product.jpg")}
                />

                <h1>{prod.name}</h1>

                <p>₹ {Number(prod.price).toLocaleString("en-IN")}</p>

                <button
                  onClick={(e) => { e.preventDefault(); addToCart?.(prod); }}
                  style={{
                    marginTop: "10px",
                    padding: "5px 15px",
                    borderRadius: "10px",
                    backgroundColor: "#ffb703",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  🛒 Add to Cart
                </button>
              </Link>
            );
          })
     

        )}
      </div>
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

      <style>
        {`
          .necklace-location {
            padding: 20px 8%;
            background-color: #f9f9f9;
          }
          .necklace-location span {
            font-size: 15px;
            color: gray;
            display: flex;
            gap: 5px;
          }
          .necklace-product-page h1 {
            font-size: 30px;
            font-family: 'Times New Roman', Times, serif;
          }
          .necklace-product-page span {
            font-size: 15px;
            color: gray;
          }
          .necklace-product-filter {
            display: flex;
            padding: 20px 8%;
            gap: 15px;
            flex-wrap: wrap;
          }
          .necklace-product-boxs {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            padding: 20px;
          }
          .filter-btn {
            padding: 8px 16px;
            border-radius: 20px;
            border: 1px solid gray;
            background: white;
            margin: 4px;
            cursor: pointer;
          }
          .filter-btn.active {
            background: #ffd780;
            border-color: orange;
          }
          .necklace-products-box {
            width: 350px;
            height: 500px;
            border: 1px solid gray;
            border-radius: 15px;
            background-color: #f9f9f9;
            box-shadow: rgba(0, 0, 1, 0.2) 0px 3px 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 30px;
            position: relative;
          }
          .necklace-products-box img {
            width: 250px;
            height: 250px;
            object-fit: contain;
          }
          .necklace-products-box h1 {
            font-size: 18px;
            margin: 10px 0;
            text-align: center;
          }
          .necklace-products-box p {
            font-size: 18px;
            color: #000;
          }
          .sicon {
            font-size: 25px;
            cursor: pointer;
          }
        `}
      </style>
    </>
  );
};

export default AllJewellery;
