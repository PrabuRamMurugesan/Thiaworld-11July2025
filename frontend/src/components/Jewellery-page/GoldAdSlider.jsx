import React, { useState, useEffect, useRef } from "react";

const products = [
  { title: "Royal Gold Necklace", image: "/assets/Banner1.jpg" },
  { title: "Elegant Gold Ring", image: "/assets/Banner3.jpg" },
  { title: "Luxury Gold Bracelet", image: "/assets/Banner2.jpg" },
];

function GoldAdSlider() {
  const [current, setCurrent] = useState(0);
  const slideRef = useRef(null);

  const slides = [...products, ...products]; // ✅ Duplicate array for continuous loop

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000); // slide every 3 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div
      style={{
        width: "100%",
        height: "600px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      <div
        ref={slideRef}
        style={{
          display: "flex",
          height: "100%",
          transform: `translateX(-${current * 100}%)`,
          transition: "transform 1s ease-in-out",
        }}
      >
        {slides.map((product, index) => (
          <div
            key={index}
            style={{
              flex: "0 0 100%",
              backgroundImage: `url(${product.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "24px",
              flexDirection: "column",
            }}
          >
            <div className="d-flex justify-content-start flex-column align-items-start w-100 p-5">
              <div
                style={{
                  padding: "10px 20px",
                  borderRadius: "5px",
                  color: "gold",
                  fontWeight: "bold",
                  fontSize: "55px",
                  fontFamily: "Arial, sans-serif",
                  textShadow: "10px -10px 8px rgba(0, 0, 0, 0.5)",
                }}
              >
                {product.title}
              </div>
              <button
                style={{
                  backgroundColor: "rgba(13,88,102)",
                  boxShadow: "0 2px 2px rgba(0,0,0,0.3)",
                  padding: "5px 25px",
                  borderRadius: "50px",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "14px",
                  cursor: "pointer",
                  marginLeft: "16%",
                }}
              >
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GoldAdSlider;
