import React, { useEffect, useState, useContext, useRef } from "react";
import Header from "../Header";
import axios from "axios";
import { IoMdArrowDropright } from "react-icons/io";
import { CartContext } from "../../context/CartContext";
import { IoHeart, IoStar } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { normalizeImages, buildImgSrc } from "../../utils/imageTools";


const AllJewellery = () => {
  
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(25);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [purityFilter, setPurityFilter] = useState([]);
  const [metalFilter, setMetalFilter] = useState([]);
  const [tagsFilter, setTagsFilter] = useState([]);
  const [loading, setLoading] = useState(true);

  const loaderRef = useRef(null);
  const location = useLocation();

  const { addToCart } = useContext(CartContext);
  const { isWished, toggle } = useWishlist();

  const [imgErrors, setImgErrors] = useState({});

  const handleImageError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    fetchAllJewellery();
  }, [search, categoryFilter, purityFilter, metalFilter, tagsFilter]);

  const fetchAllJewellery = async () => {
    try {
      setLoading(true);
      setVisibleCount(20);

      let query = [];

      if (categoryFilter.length)
        query.push(`category=${categoryFilter.join(",")}`);
      if (purityFilter.length)
        query.push(`purity=${purityFilter.join(",")}`);
      if (metalFilter.length)
        query.push(`metalType=${metalFilter.join(",")}`);
      if (tagsFilter.length)
        query.push(`tags=${tagsFilter.join(",")}`);
      if (search) query.push(`search=${search}`);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URI}/products/all?${query.join("&")}`
      );

      setProducts(res.data);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INFINITE SCROLL ================= */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting && visibleCount < products.length) {
          setVisibleCount((prev) => prev + 20);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "150px",
      }
    );

    const loader = loaderRef.current;
    if (loader) observer.observe(loader);

    return () => {
      if (loader) observer.unobserve(loader);
    };
  }, [visibleCount, products.length]);

  const visibleProducts = products.slice(0, visibleCount);

  const resolveImage = (prod) => {
    try {
      const arr = normalizeImages(prod.images || []);
      if (arr.length === 0) return "/default-product.jpg";
      return buildImgSrc(arr[0]) || "/default-product.jpg";
    } catch {
      return "/default-product.jpg";
    }
  };

  const toggleFilter = (type, value) => {
    const map = {
      tags: [tagsFilter, setTagsFilter],
      purity: [purityFilter, setPurityFilter],
      metalType: [metalFilter, setMetalFilter],
    };

    const [filter, setFilter] = map[type];

    setFilter(
      filter.includes(value)
        ? filter.filter((v) => v !== value)
        : [...filter, value]
    );
  };

  return (
    <>
      <Header />

      {/* ===== Breadcrumb ===== */}
      <div className="necklace-location">
        <Link to="/">Home</Link>
        <IoMdArrowDropright /> All Jewellery
      </div>

      {/* ===== Title + Count ===== */}
      <div className="page-header">
        <h1>
          All Jewellery
          <span className="result-count">
            ({visibleProducts.length} of {products.length})
          </span>
        </h1>

        <input
          type="text"
          placeholder="Search jewellery..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ===== Filters ===== */}
      <div className="filter-row">
        {["Rings", "Chains", "Necklace", "Earrings"].map((cat) => (
          <button
            key={cat}
            onClick={() => toggleFilter("tags", cat)}
            className={`filter-btn ${
              tagsFilter.includes(cat) ? "active" : ""
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ===== Products Grid ===== */}
      <div className="product-grid">
        {loading ? (
          <div className="network-loader">
            <div className="spinner-border text-dark" />
          </div>
        ) : visibleProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          visibleProducts.map((prod) => {
            const img = resolveImage(prod);

            return (
              <Link
                to={`/product/${prod._id}`}
                key={prod._id}
                className="product-card"
              >
<div className="product-card border p-3">
  <div className="card-icons">
    <IoHeart
      className="heart-icon"
      onClick={(e) => {
        e.preventDefault();
        toggle(prod._id);
      }}
    />
  </div>

  {!imgErrors[prod._id] ? (
    <img
      className="product-img"
      src={img}
      alt={prod.name}
      onError={() => handleImageError(prod._id)}
    />
  ) : (
    <div className="fallback">
      <img
        src="https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-icon-for-unavailable-image-and-photo-camera-in-flat-vector-illustration-vector-png-image_40968558.jpg"
        alt="placeholder"
        style={{width:'100px',height:'100px'}}
      />
    </div>
  )}
</div>

               <h3 className="whitespace-nowrap">{prod.name}</h3>
                <p>₹ {Number(prod.price).toLocaleString("en-IN")}</p>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(prod);
                  }}
                >
                  Add to Cart
                </button>
              </Link>
            );
          })
        )}
      </div>

      {/* ===== Infinite Loader ===== */}
      {!loading && visibleCount < products.length && (
        <div ref={loaderRef} className="bottom-loader">
          <div className="spinner-border text-secondary" />
        </div>
      )}

      {!loading && visibleCount >= products.length && (
        <div className="end-message">No more products</div>
      )}

      {/* ================== STYLES ================== */}
      <style> {`

      /* 🧱 Product Card */
.product-card {
  position: relative;
  border-radius: 12px;
  background: #fff;
  transition: all 0.25s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}

/* ❤️ Icons */
.card-icons {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}

.heart-icon {
  font-size: 20px;
  cursor: pointer;
  color: gray;
  transition: all 0.2s ease;
}

.heart-icon:hover {
  transform: scale(1.15);
  color: #e03131;
}

/* 🖼 Product Image */
.product-img {
  width: 100%;
  height: 180px;
  object-fit: contain;
  margin-top: 10px;
  transition: transform 0.3s ease;
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

/* 🧩 Fallback Image */
.fallback {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
}

.fallback img {
  width: 60%;
  opacity: 0.7;
}

/* 📱 Mobile Responsive */
@media (max-width: 768px) {
  .product-img,
  .fallback {
    height: 140px;
  }

  .heart-icon {
    font-size: 18px;
  }

  .card-icons {
    top: 8px;
    right: 8px;
  }
}
      /* ===== PAGE LAYOUT ===== */

.necklace-location {
  padding: 18px 8%;
  background: #f8f8f8;
  font-size: 14px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 6px;
}

.necklace-location a {
  text-decoration: none;
  color: #222;
  font-weight: 500;
}

.necklace-location a:hover {
  color: #c59b2a;
}

/* ===== HEADER ===== */

.page-header {
  padding: 24px 8%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 600;
  margin: 0;
}

.result-count {
  font-size: 16px;
  color: gray;
  margin-left: 10px;
  font-weight: 400;
}

/* ===== SEARCH ===== */

.page-header input {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #ddd;
  min-width: 240px;
  outline: none;
  transition: 0.2s ease;
}

.page-header input:focus {
  border-color: #c59b2a;
  box-shadow: 0 0 0 3px rgba(197, 155, 42, 0.15);
}

/* ===== FILTERS ===== */

.filter-row {
  padding: 10px 8%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: #c59b2a;
  color: #c59b2a;
}

.filter-btn.active {
  background: #ffd780;
  border-color: #e6b85c;
  color: #222;
  font-weight: 500;
}

/* ===== PRODUCT GRID ===== */

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 26px;
  padding: 26px 8%;
}

/* ===== PRODUCT CARD ===== */

.product-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.12);
}

/* ===== IMAGE ===== */

.product-card img {
  width: 100%;
  height: 230px;
  object-fit: cover;
  border-radius: 10px;
  transition: transform 0.35s ease;
}

.product-card:hover img {
  transform: scale(1.05);
}

/* ===== ICONS ===== */

.card-icons {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  font-size: 22px;
}

.card-icons svg {
  cursor: pointer;
  transition: 0.2s ease;
}

.card-icons svg:hover {
  transform: scale(1.15);
}

/* ===== PRODUCT TEXT ===== */

.product-card h3 {
  font-size: 16px;
  margin: 12px 0 6px;
  font-weight: 500;
  color: #222;
}

.product-card p {
  font-size: 15px;
  color: #444;
  margin: 0 0 12px;
  font-weight: 600;
}

/* ===== BUTTON ===== */

.product-card button {
  border: none;
  background: #dbc70e;
  color: black;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.25s ease;
  width: 100%;
}

.product-card button:hover {
  background: #f08103c4;
  transform: translateY(-1px);
}

/* ===== FALLBACK IMAGE ===== */

.fallback {
  width: 100%;
  height: 230px;
  border-radius: 10px;
  background: #f7efef;
  display: flex;
  align-items: center;
  justify-content: center;
  
}

.fallback img {
  width: 60%;
  opacity: 0.7;
}

/* ===== LOADERS ===== */

.network-loader,
.bottom-loader {
  text-align: center;
  padding: 40px;
}

.spinner-border {
  width: 2.5rem;
  height: 2.5rem;
}

/* ===== END MESSAGE ===== */

.end-message {
  text-align: center;
  padding: 30px;
  color: gray;
  font-size: 14px;
}

/* ===================================================== */
/* ================= MOBILE RESPONSIVE ================= */
/* ===================================================== */

@media (max-width: 768px) {
  .necklace-location {
    padding: 14px 16px;
    font-size: 13px;
  }

  .page-header {
    padding: 18px 16px;
  }

  .page-header h1 {
    font-size: 22px;
  }

  .result-count {
    font-size: 13px;
  }

  .page-header input {
    width: 100%;
    min-width: unset;
  }

  .filter-row {
    padding: 8px 12px;
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .filter-btn {
    white-space: nowrap;
    font-size: 13px;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    padding: 14px 10px;
  }

  .product-card {
    padding: 10px;
    border-radius: 10px;
  }

  .product-card img,
  .fallback {
    height: 160px;
  }

  .product-card h3 {
    font-size: 13px;
  }

  .product-card p {
    font-size: 13px;
  }

  .product-card button {
    font-size: 12px;
    padding: 6px;
  }

  .card-icons {
    font-size: 18px;
  }
}

/* ===== SMALL MOBILE ===== */

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .product-card img,
  .fallback {
    height: 140px;
  }
}
      `}</style>
    </>
  );
};

export default AllJewellery;