import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { FaUnlockKeyhole } from "react-icons/fa6";
function ThiaSecure() {
  return (
    <>
      <Header />

      <div className="bg-gray-50 text-gray-800 p-5 my-8 max-w-6xl mx-auto border rounded-xl shadow-lg">
        {/* Header Section */}
        <div className="font-serif text-3xl text-center text-yellow-600 pb-2 border-b border-gray-400">
          <div className="flex justify-center pb-2">
            <img
              src="/assets/thiaworld.png"
              alt="Thiaworld logo"
              className="w-[450px] h-[100px] object-contain"
            />
          </div>
          <span className="block pb-2">
            Thia Secure Plan – Your Jewellery. Your Way. Your Control.
          </span>
          <span className="block pb-4">Found Only on BBSCART.COM.</span>
        </div>

        {/* How It Works */}
        <h2 className="font-serif text-2xl mt-6 px-10">Here’s How It Works:</h2>
        <ul className="font-serif text-lg text-justify mt-2 px-10 list-none space-y-1">
          <li className="flex items-center gap-2">
            • Pay 40% now to lock the design and price
          </li>
          <li className="flex items-center gap-2">
            • Your jewellery is safely reserved and stored
          </li>
          <li className="flex items-center gap-2">
            • Pay the remaining 60% whenever you're ready
          </li>
        </ul>

        {/* Why People Love It */}
        <h3 className="font-serif text-2xl mt-6 px-10">
        Why People Love Thia Secure Plan:
        </h3>
        <ul className="font-serif text-lg text-justify mt-2 px-10 list-none space-y-1">
          <li className="flex items-center gap-2">
            • Secure gold rate lock on the day of booking
          </li>
          <li className="flex items-center gap-2">
            • Pay the remaining 60% whenever you're ready
          </li>
          <li className="flex items-center gap-2">
            • Safe storage until final purchase
          </li>
          <li className="flex items-center gap-2">
            • No hidden charges, all-inclusive pricing
          </li>
        </ul>

        {/* Closing Text */}
        <p className="font-serif text-lg text-justify mt-5 px-10">
          Whether you’re planning a gift, preparing for a celebration, or just
          waiting for the perfect time—Thia Secure Plan lets you plan smart, shop
          calm, and sparkle with confidence.
        </p>

        <p className="font-serif text-lg mt-5 px-10 text-center pb-5">
          Only on <strong>BBSCART.COM</strong> – Powered by Thiaworld Jewellery & Golddex.
        </p>
      </div>

      <Footer />
    </>
  );
}

export default ThiaSecure;
