import React, { useState, useEffect, useRef } from "react";

const products = [
  { title: "Royal Gold Necklace", image: "/assets/Banner1.jpg" },
  { title: "Elegant Gold Ring",   image: "/assets/Banner3.jpg" },
  { title: "Luxury Gold Bracelet", image: "/assets/Banner2.jpg" },
];

function GoldAdSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused]   = useState(false);
  const slideRef = useRef(null);

  const slides = [...products, ...products]; // duplicate for seamless loop

  useEffect(() => {
    if (paused) return;                 // stop sliding when paused
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000); // slide every 3s
    return () => clearInterval(interval);
  }, [slides.length, paused]);

  return (
    <div
      ref={slideRef}
      // pause on hover/focus
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="
        relative overflow-hidden w-full
        h-[30vh] sm:h-[50vh] md:h-[50vh] lg:h-[500px]
        shadow-lg
      "
    >
      <div
        className="flex h-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((product, index) => (
          <div
            key={index}
            className="
              flex-shrink-0 w-full h-full bg-cover bg-center
              flex flex-col justify-center items-start
              px-6 sm:px-10 md:px-16
            "
            style={{ backgroundImage: `url(${product.image})` }}
          >
            <h2
              className="
                text-gold font-bold
                text-2xl sm:text-3xl md:text-5xl lg:text-6xl
                drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]
              "
              style={{ color: "gold" }}
            >
              {product.title}
            </h2>
            <a
              href="/product-card"
              className="
                mt-6 inline-block rounded-full
                bg-[rgb(13,88,102)] text-white font-semibold
                text-sm sm:text-base md:text-lg
                px-6 py-2 shadow-md hover:shadow-lg
              "
            >
              Shop Now
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GoldAdSlider;
