import React, { useState } from "react";
import Zoom from "../../public/assets/zoom.png";
import Fast from "../../public/assets/fast.png";
import Gift from "../../public/assets/gift.png";
import Return from "../../public/assets/return.png";
import { FaStar, FaHeart, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Popular from "./PopularSearch";
import JewelleryMaintenance from "./JewelleryMaintenance";
import PriceBreakup from "./PriceBreakup";

const ProductBottom = ({ product }) => {
  return <Product product={product} />;
};

const products = [
  {
    id: 1,
    image:
      "https://i.etsystatic.com/14370418/r/il/ea18e6/2821390514/il_fullxfull.2821390514_7k0j.jpg",
    name: "Gold Necklace",
    price: "₹45,999",
    oldPrice: "₹52,000",
    off: "12%",
  },
  {
    id: 2,
    image:
      "https://cdnmedia-breeze.vaibhavjewellers.com/media/catalog/product/image/131375519/22kt-gold-zamindhari-men-god-ring-94vh2647-94vh2647.jpg",
    name: "Gold Ring",
    price: "₹12,499",
    oldPrice: "₹14,000",
    off: "10%",
  },
  {
    id: 3,
    image:
      "https://cdn.shopify.com/s/files/1/2988/2568/products/0E8A7510-3_2048x2048.jpg?v=1590608355",
    name: "Gold Bracelet",
    price: "₹22,999",
    oldPrice: "₹26,000",
    off: "11%",
  },
  {
    id: 4,
    image:
      "https://i.pinimg.com/originals/84/c2/88/84c288e55e4bccf30703383eddfe65f1.jpg",
    name: "Gold Chain",
    price: "₹18,499",
    oldPrice: "₹21,000",
    off: "12%",
  },
  {
    id: 5,
    image:
      "https://i.pinimg.com/originals/a4/50/51/a45051f7ac770ec914d6e302beefb712.jpg",
    name: "Gold Chain",
    price: "₹18,499",
    oldPrice: "₹21,000",
    off: "12%",
  },
];
function Product({ product }) {
 

  const [start, setStart] = useState(0);
  const visible = 3;

  const next = () => {
    if (start + visible < products.length) setStart(start + 1);
  };

  const prev = () => {
    if (start > 0) setStart(start - 1);
  };

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

      {/* More from this collection section */}
      <div style={{ position: "relative", padding: "20px" }}>
        <h4 style={{ fontWeight: "700", marginBottom: "15px" }}>
          More from this collection
        </h4>

        {/* Left arrow */}
        <button
          onClick={prev}
          style={{
            position: "absolute",
            top: "50%",
            left: "5px",
            transform: "translateY(-50%)",
            background: "#fff",
            borderRadius: "50%",
            border: "1px solid #ccc",
            width: "35px",
            height: "35px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: "1",
          }}
        >
          <FaArrowLeft />
        </button>

        {/* Slider container */}
        <div
          style={{
            display: "flex",
            overflow: "hidden",
            scrollBehavior: "smooth",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "15px",
              transform: `translateX(-${start * 33.3}%)`,
              transition: "transform 0.4s ease",
            }}
          >
            {products.map((p) => (
              <div
                key={p.id}
                style={{
                  position: "relative",
                  width: "300px",
                  height: "300px",
                  flexShrink: 0,
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                {/* Top icons */}
                <FaStar
                  color="gold"
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    fontSize: "20px",
                  }}
                />
                <FaHeart
                  color="red"
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    fontSize: "20px",
                  }}
                />

                {/* Bottom info */}
                <div
                  className="d-flex flex-row"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    background: "rgba(0,0,0,0.6)", // optional, makes text readable
                    color: "#fff",
                    textAlign: "center",
                    padding: "8px 10px",
                    justifyContent: "space-between", // spread across the row
                    alignItems: "center", // vertical alignment
                    gap: "10px", // optional spacing
                  }}
                >
                  <div style={{ fontWeight: "600", fontSize: "14px" }}>
                    {p.price}
                  </div>
                  <div
                    style={{
                      textDecoration: "line-through",
                      fontSize: "12px",
                      opacity: 0.7,
                    }}
                  >
                    {p.oldPrice}
                  </div>
                  <div
                    style={{
                      color: "#f9d423",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    {p.off} OFF
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right arrow */}
        <button
          onClick={next}
          style={{
            position: "absolute",
            top: "50%",
            right: "5px",
            transform: "translateY(-50%)",
            background: "#fff",
            borderRadius: "50%",
            border: "1px solid #ccc",
            width: "35px",
            height: "35px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <FaArrowRight />
        </button>
      </div>
      
      <JewelleryMaintenance/>
      <Popular/>
    </>
  );
}

export default ProductBottom;