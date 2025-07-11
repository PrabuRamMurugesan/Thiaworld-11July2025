import React, { useState, useEffect } from "react";
import { IoMdHeart } from "react-icons/io";

function ProductBox() {
  const [images, setImages] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isRed, setIsRed] = useState(false);

  const handleClickHeart = (e) => {
    e.stopPropagation();
    setIsRed(!isRed);
  };

  useEffect(() => {
    setImages([
      "https://i.pinimg.com/originals/b3/c2/19/b3c21984fbb97872b8a870ba012125d5.jpg",
      "https://blog.southindiajewels.com/wp-content/uploads/2022/05/Stone-Studded-Jewellery-Sets5-696x1227.jpg"
    ]);
  }, []);

  // Example product data
  const product = {
    title: "Elegant Gold Necklace",
    currentPrice: 1499,
    previousPrice: 1999,
  };

  const saveRate = Math.round(
    ((product.previousPrice - product.currentPrice) / product.previousPrice) * 100
  );

  return (
    <div
      style={{
        width: "400px",
        position: "relative",
        overflow: "hidden",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div style={{ height: "450px", position: "relative" }}>
        {images.length > 0 && (
          <img
            src={isHovered ? images[1] : images[0]}
            alt="Product"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "opacity 0.3s ease-in-out",
            }}
          />
        )}

        {/* Heart icon */}
        <div
          onClick={handleClickHeart}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            borderRadius: "50%",
            padding: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <IoMdHeart
            style={{
              color: isRed ? "red" : "orange",
              fontSize: "24px",
            }}
          />
        </div>

        {/* Sale tag */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "red",
            color: "white",
            padding: "3px 8px",
            borderRadius: "5px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          SALE
        </div>
      </div>

      {/* Product details */}
      <div style={{ padding: "10px" }}>
        <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "5px" ,textAlign:"center"}}>
          {product.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px",justifyContent:"center" }}>
          <div style={{ color: "green", fontWeight: "bold", }}>
            ₹{product.currentPrice}
          </div>
          <div style={{ textDecoration: "line-through", color: "#999", fontSize: "14px" }}>
            ₹{product.previousPrice}
          </div>
          <div style={{ color: "red", fontSize: "12px", fontWeight: "bold" }}>
            Save {saveRate}%
          </div>
        </div>
        <button
          style={{
            marginTop: "8px",
            width: "100%",
            padding: "8px",
            backgroundColor: "#ff9900",
            border: "none",
            borderRadius: "5px",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductBox;
