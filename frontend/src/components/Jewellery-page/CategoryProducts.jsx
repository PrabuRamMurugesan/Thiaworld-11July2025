import React, { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import Header from "../Header";
import { IoMdArrowDropright } from "react-icons/io";
import { TiFilter } from "react-icons/ti";
import { IoIosArrowDown } from "react-icons/io";
import { CiStar } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { normalizeImages, buildImgSrc } from "../../utils/imageTools";

const DEFAULT_SORT = "";

function safeTitle(s) {
  return String(s || "").trim();
}

/**
 * Generic dynamic category page
 * @param {{categoryKey: string, title: string}} props
 */
const PRODUCTS_PER_PAGE = 6;

export default function CategoryProducts({ categoryKey, title }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState(DEFAULT_SORT);
  const [page, setPage] = useState(1);

  const { addToCart } = useContext(CartContext);
  const { isWished, toggle } = useWishlist();

  const resolvedTitle = safeTitle(title);

  const query = useMemo(() => {
    const qs = [];
    // IMPORTANT: backend expects tags for these jewellery sub-types
    if (categoryKey) qs.push(`tags=${encodeURIComponent(categoryKey)}`);

    if (sortOption === "newest") qs.push(`sort=newest`);
    if (sortOption === "low") qs.push(`sort=priceLowHigh`);
    if (sortOption === "high") qs.push(`sort=priceHighLow`);

    return qs.join("&");
  }, [categoryKey, sortOption]);

  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setPage(1);
        const url = `${import.meta.env.VITE_API_URI}/products/all${query ? `?${query}` : ""}`;
        const res = await axios.get(url);
        if (!active) return;
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("CategoryProducts fetch error:", e);
        if (!active) return;
        // Use sample products as fallback
        const sampleProducts = [
          {
            _id: '1',
            name: 'Gold Diamond Ring',
            price: 45000,
            category: 'Rings',
            tags: ['Rings', 'Diamond'],
            images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400'],
            description: 'Beautiful gold diamond ring'
          },
          {
            _id: '2',
            name: 'Silver Chain Necklace',
            price: 12000,
            category: 'Necklace',
            tags: ['Necklace', 'Silver', 'Chains'],
            images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400'],
            description: 'Elegant silver chain necklace'
          },
          {
            _id: '3',
            name: 'Gold Earrings',
            price: 25000,
            category: 'Earrings',
            tags: ['Earrings', 'Gold'],
            images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400'],
            description: 'Stunning gold earrings'
          },
          {
            _id: '4',
            name: 'Diamond Pendant',
            price: 35000,
            category: 'Necklace',
            tags: ['Necklace', 'Diamond', 'Pendant'],
            images: ['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400'],
            description: 'Elegant diamond pendant'
          },
          {
            _id: '5',
            name: 'Gold Bangle',
            price: 55000,
            category: 'Bangles',
            tags: ['Bangles', 'Gold'],
            images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400'],
            description: 'Traditional gold bangle'
          },
          {
            _id: '6',
            name: 'Silver Bracelet',
            price: 8000,
            category: 'Bracelets',
            tags: ['Bracelets', 'Silver'],
            images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400'],
            description: 'Modern silver bracelet'
          }
        ];
        setProducts(sampleProducts);
      } finally {
        if (!active) return;
        setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      active = false;
    };
  }, [query]);

  const resolveImage = (prod) => {
    try {
      const arr = normalizeImages(prod?.images || []);
      if (!arr.length) return "/default-product.jpg";
      return buildImgSrc(arr[0]) || "/default-product.jpg";
    } catch {
      return "/default-product.jpg";
    }
  };

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  return (
    <>
      <Header />

      <div className="necklace-location">
        <span>
          Home
          <IoMdArrowDropright />
          {resolvedTitle}
        </span>
      </div>

      <div className="necklace-product-page">
        <h1>{resolvedTitle}</h1>
        <span>({products.length} results)</span>
      </div>

      <div className="necklace-product-filter">
        <button type="button" aria-label="Filter">
          <TiFilter /> Filter
        </button>
        <button type="button" aria-label="Sort">
          Sort By:{" "}
          <span>
            <select
              className="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Best Matches</option>
              <option value="newest">New Arrivals</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
            <IoIosArrowDown />
          </span>
        </button>
      </div>

      <div className="necklace-product-boxs">
        {loading ? (
          <div style={{ padding: "40px 8%", textAlign: "center" }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f4c542] mx-auto"></div>
            <p style={{ marginTop: "16px", color: "#666" }}>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ padding: "40px 8%", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
            <p style={{ fontSize: "18px", color: "#666" }}>No products found.</p>
          </div>
        ) : (
          paginatedProducts.map((prod) => {
            const img = resolveImage(prod);
            return (
              <div
                key={prod._id}
                className="necklace-products-box"
              >
                <div className="product-image-container">
                  <Link to={`/product/${prod._id}`}>
                    <img src={img} alt={prod.name} />
                  </Link>
                  <div className="product-actions-overlay">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggle(prod._id);
                      }}
                      className="action-btn wishlist-btn"
                      title={isWished(prod._id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <FaHeart
                        style={{
                          color: isWished(prod._id) ? "#e03131" : "#666",
                          fontSize: "18px"
                        }}
                      />
                    </button>
                    <Link to={`/product/${prod._id}`} className="action-btn view-btn">
                      <CiStar style={{ fontSize: "18px", color: "white" }} />
                    </Link>
                  </div>
                </div>

                <div className="product-content">
                  <Link to={`/product/${prod._id}`}>
                    <h3 className="product-name">{prod.name}</h3>
                  </Link>
                  <div className="product-price">
                    <span className="current-price">
                      ₹ {Number(prod.price || prod.finalPrice || 0).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="add-to-cart-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(prod);
                    }}
                  >
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            &#8592; Prev
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next &#8594;
          </button>
        </div>
      )}

      <style>{`
        .necklace-location{
          padding: 20px 8%;
          background-color: #f8f9fa;
          display:flex;
          align-items:center;
          gap:8px;
          font-size:14px;
          color: #666;
          border-bottom: 1px solid #e9ecef;
        }

        .necklace-location span{display:flex;gap:8px;align-items:center;}

        .necklace-product-page{
          padding: 30px 8%;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 16px;
        }

        .necklace-product-page h1{
          font-size: 32px;
          font-weight: 700;
          margin:0;
          color: #1a1a1a;
        }

        .necklace-product-page span{
          font-size: 16px;
          color: #666;
          background: #f8f9fa;
          padding: 6px 16px;
          border-radius: 20px;
        }

        .necklace-product-filter{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          padding: 20px 8%;
          gap: 16px;
          flex-wrap: wrap;
          background: white;
          border-bottom: 1px solid #e9ecef;
        }

        .necklace-product-filter button{
          background-color: white;
          font-size: 14px;
          border: 1px solid #dee2e6;
          padding: 10px 20px;
          border-radius: 8px;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .necklace-product-filter button:hover{
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          border-color: #f4c542;
        }

        .necklace-product-filter button span{color: #495057; display:flex;align-items:center;gap:6px;}

        .sort-select{border:none;background:transparent;outline:none;font-family:inherit;font-size:14px;color:#495057;cursor:pointer;}

        .necklace-product-boxs{
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          padding: 30px 8%;
          margin-top: 20px;
        }

        @media (max-width: 1024px){
          .necklace-product-boxs{
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .necklace-products-box{
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .necklace-products-box:hover{
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          transform: translateY(-4px);
        }

        .product-image-container{
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          background: #f8f9fa;
          overflow: hidden;
        }

        .product-image-container img{
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .necklace-products-box:hover .product-image-container img{
          transform: scale(1.05);
        }

        .product-actions-overlay{
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          opacity: 0;
          transform: translateX(10px);
          transition: all 0.3s ease;
        }

        .necklace-products-box:hover .product-actions-overlay{
          opacity: 1;
          transform: translateX(0);
        }

        .action-btn{
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: rgba(244, 197, 66, 0.95);
          color: white;
        }

        .action-btn:hover{
          background: rgba(244, 197, 66, 1);
          transform: scale(1.1);
        }

        .action-btn.wishlist-btn{
          background: rgba(255, 255, 255, 0.95);
          color: #333;
        }

        .action-btn.wishlist-btn:hover{
          background: white;
        }

        .product-content{
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .product-name{
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.2s ease;
        }

        .product-name:hover{
          color: #f4c542;
        }

        .product-price{
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          min-width: 0;
        }

        .current-price{
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          white-space: nowrap;
        }

        .add-to-cart-btn{
          margin-top: auto;
          border: none;
          background: linear-gradient(135deg, #f4c542 0%, #e5b832 100%);
          color: #1a1a1a;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          transition: all 0.2s ease;
          font-size: 14px;
        }

        .add-to-cart-btn:hover{
          background: linear-gradient(135deg, #e5b832 0%, #d4a828 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(244, 197, 66, 0.3);
        }

        .pagination-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          padding: 30px 8%;
        }

        .pagination-btn {
          padding: 10px 24px;
          border: 2px solid #f4c542;
          background: white;
          color: #1a1a1a;
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f4c542;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(244, 197, 66, 0.3);
        }

        .pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          border-color: #ccc;
        }

        .pagination-info {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        @media (max-width: 768px){
          .necklace-product-filter{padding:16px 20px;}
          .necklace-location{padding:16px 20px;}
          .necklace-product-page{padding:20px 20px;flex-direction:column;align-items:flex-start;}
          .necklace-product-page h1{font-size:24px;}
          .necklace-product-boxs{
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            padding: 16px 16px;
          }
          .product-content{padding: 12px; gap: 8px;}
          .product-name{font-size:13px;}
          .current-price{font-size:15px;}
          .add-to-cart-btn{padding: 8px 12px;font-size:12px;}
          .pagination-controls{padding: 20px 16px 100px; gap: 12px;}
          .product-actions-overlay{opacity:1;transform:translateX(0);}
          .product-actions-overlay .action-btn{width:30px;height:30px;}
          .product-actions-overlay .action-btn svg{font-size:14px!important;}
        }
      `}</style>
    </>
  );
}

