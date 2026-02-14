import React, { useState, useEffect } from "react";
import axios from "axios";
import Zoom from "../../public/assets/zoom.png";
import Fast from "../../public/assets/fast.png";
import Gift from "../../public/assets/gift.png";
import Return from "../../public/assets/return.png";
import { FaStar, FaHeart } from "react-icons/fa";
import Popular from "./PopularSearch";
import JewelleryMaintenance from "./JewelleryMaintenance";
import PriceBreakup from "./PriceBreakup";
import MoreFromCollection from "./MoreFromCollection";

const ProductBottom = ({ product }) => {
  const [relatedItems, setRelatedItems] = useState([]);

  useEffect(() => {
    if (!product) return;
    const loadRelated = async () => {
      try {
        const query = [];
        if (product.category) query.push(`category=${encodeURIComponent(product.category)}`);
        else if (Array.isArray(product.tags) && product.tags.length)
          query.push(`tags=${encodeURIComponent(product.tags[0])}`);

        // limit to 10 for performance
        const res = await axios.get(
          `${import.meta.env.VITE_API_URI}/products/all?${query.join("&")}&limit=10`
        );
        const items = Array.isArray(res.data) ? res.data : [];
        setRelatedItems(items.filter((p) => p._id !== product._id));
      } catch (err) {
        console.error("Failed to fetch related items", err);
      }
    };
    loadRelated();
  }, [product]);

  return <Product product={product} relatedItems={relatedItems} />;
};

// fallback static list is no longer needed; dynamic data will be fetched above

function Product({ product, relatedItems = [] }) {
  // `relatedItems` will be injected by the parent and used below

  return (
    <>
      <div
        className="d-flex justify-content-around flex-wrap gap-4 py-4 m-3"
        style={{
          background:
            "linear-gradient(135deg, #fff8e1 0%, #ffecb3 50%, #fff8e1 100%)",
          boxShadow: "0 0 25px rgba(255, 215, 0, 0.3)",
          borderRadius: "20px",
        }}
      >
        <div
          className="d-flex flex-column align-items-center text-center"
          style={{ maxWidth: "220px" }}
        >
          <img src={Zoom} alt="" className="mb-3" style={{ width: "80px" }} />
          <h3 style={{ color: "#7a5901", fontWeight: "700" }}>
            BIS Hallmark Jewelry
          </h3>
          <p style={{ color: "#5c4b00" }}>
            Authenticity Guaranteed, Purity Assured
          </p>
        </div>

        <div
          className="d-flex flex-column align-items-center text-center"
          style={{ maxWidth: "220px" }}
        >
          <img src={Fast} alt="" className="mb-3" style={{ width: "80px" }} />
          <h3 style={{ color: "#7a5901", fontWeight: "700" }}>Fast Shipping</h3>
          <p style={{ color: "#5c4b00" }}>
            Swift & Secure Delivery to Your Doorstep
          </p>
        </div>

        <div
          className="d-flex flex-column align-items-center text-center"
          style={{ maxWidth: "220px" }}
        >
          <img src={Gift} alt="" className="mb-3" style={{ width: "80px" }} />
          <h3 style={{ color: "#7a5901", fontWeight: "700" }}>
            Free Insured Shipping
          </h3>
          <p style={{ color: "#5c4b00" }}>
            Your Precious Jewellery, Protected Every Step of the Way
          </p>
        </div>

        <div
          className="d-flex flex-column align-items-center text-center"
          style={{ maxWidth: "220px" }}
        >
          <img src={Return} alt="" className="mb-3" style={{ width: "80px" }} />
          <h3 style={{ color: "#7a5901", fontWeight: "700" }}>Return Policy</h3>
          <p style={{ color: "#5c4b00" }}>15 Days Easy Returns Guaranteed</p>
        </div>
      </div>

      <div
        style={{
          background:
            "linear-gradient(135deg, #fff8e1 0%, #ffecb3 50%, #fff8e1 100%)",
          boxShadow: "0 0 25px rgba(255, 215, 0, 0.3)",
          borderRadius: "20px",
          padding: "30px",
          textAlign: "left",
          margin: "20px",
        }}
      >
        <div className="mb-4">
          <h1
            style={{
              color: "#7a5901",
              fontWeight: "700",
              marginBottom: "15px",
            }}
          >
            Product Description
          </h1>
          <p
            style={{
              color: "#5c4b00",
              borderLeft: "4px solid #c8a200",
              paddingLeft: "15px",
              lineHeight: "1.7",
              fontSize: "16px",
              width: "65%",
            }}
          >
            Adorn yourself with this stunning 22KT Gold necklace featuring an
            intricate filigree design. Perfect for parties, this long necklace
            showcases excellent craftsmanship. Enjoy free insured shipping when
            you buy online from GRT Jewellers.
          </p>
        </div>

        <div>
          <h1
            style={{
              color: "#7a5901",
              fontWeight: "700",
              marginBottom: "15px",
            }}
          >
            Product Information
          </h1>
          <div
            style={{
              color: "#5c4b00",
              borderLeft: "4px solid #c8a200",
              paddingLeft: "15px",
              lineHeight: "1.8",
            }}
          >
            <h6 style={{ color: "#7a5901", fontWeight: "600" }}>
              Metal and Purity
            </h6>
            <p style={{ marginBottom: "12px" }}>Gold 91.6%</p>

            <h6 style={{ color: "#7a5901", fontWeight: "600" }}>Weight</h6>
            <p>21.08gms</p>
          </div>
        </div>
      </div>

     <PriceBreakup product={product} />

      {/* More from this collection (dynamic) */}
      <MoreFromCollection items={relatedItems} />

      {/* <JewelleryMaintenance/> */}
      <Popular/>
    </>
  );
}

export default ProductBottom;