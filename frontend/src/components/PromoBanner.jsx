import React from 'react';
import { useNavigate } from "react-router-dom";

const PromoBanner = () => {
    const navigate = useNavigate();

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <div className="relative rounded-lg overflow-hidden shadow-lg bg-white">
        {/* Promo Image */}
        <img
          src="/assets/promo-banner.jpg"
          alt="Festival Offer Banner"
          className="w-full h-[200px] object-cover"
        />

        {/* Overlay Text and CTA */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
          <h2 className="text-xl sm:text-3xl font-semibold mb-2">
            Celebrate With Gold — Festive Offers Live ✨
          </h2>
          <p className="text-sm sm:text-base mb-4">
            Limited-time discounts on premium 22K and 24K jewelry collections.
          </p>
          <button
            onClick={() => navigate("/gold-collection")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded font-medium shadow"
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;