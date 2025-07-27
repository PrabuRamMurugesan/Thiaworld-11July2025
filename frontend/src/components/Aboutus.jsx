import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { MdDiamond } from "react-icons/md";
import { FaCircleNotch } from "react-icons/fa6";

function Aboutus() {
  return (
    <>
      <Header />
      <div className="bg-gray-50 text-gray-800 p-5  my-8 max-w-6xl mx-auto border rounded-xl shadow-lg">
        <div className="font-serif text-3xl text-center text-yellow-600 pb-2 border-b border-gray-400 ">
          <span className="block pb-2 ">
            <div className="flex justify-center">
              <img
                src="/assets/thiaworld.png"
                alt="Thiaworld logo"
                className="w-[450px] h-[100px] object-contain"
              />
            </div>
            {/* <div className="flex justify-center mb-3"><FaCircleNotch className="animate-spin size-8" /><FaCircleNotch className="animate-spin size-8" /></div> */}
            Thiaworld Jewellery – Crafted for Every Story.
          </span>
          <span className="block pb-4 ">Found Only on BBSCART.COM.</span>
        </div>

        <p className="font-serif text-lg text-justify mt-5 px-10">
          {" "}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;At{" "}
          <em className="text-yellow-700">BBSCART</em>, we believe jewellery
          isn’t just about gold or silver—it’s about memories, milestones, and
          meaning. That’s why we created{" "}
          <em className="text-yellow-700">Thiaworld Jewellery</em>, a collection
          that blends traditional craftsmanship with modern sensibilities
        </p>

        <p className="font-serif text-lg text-justify mt-5 px-10">
          From the{" "}
          <em className="text-yellow-700">warmth of 22K BIS Hallmarked Gold</em>{" "}
          to the{" "}
          <em className="text-yellow-700">
            timeless shine of 925 Sterling Silver
          </em>
          , and the brilliance of{" "}
          <em className="ttext-yellow-700">diamond and platinum</em>—every piece
          in the Thiaworld collection carries a story, ready to become part of
          yours.
        </p>

        <h3 className="font-serif text-2xl text-start mt-5 px-10">
          Why Thiaworld ?
        </h3>

        <ul className="font-serif text-lg text-justify mt-2 px-10 list-none space-y-1">
          <li className="flex items-center gap-2">
            <MdDiamond className="text-indigo-500" /> Authentic Designs, Direct
            from Our Goldsmiths
          </li>
          <li className="flex items-center gap-2">
            <MdDiamond className="text-indigo-500" /> Fully Certified Precious
            Metals & Stones
          </li>
          <li className="flex items-center gap-2">
            <MdDiamond className="text-indigo-500" /> Flexible Pricing Options –
            Partial Payment & More
          </li>
          <li className="flex items-center gap-2">
            <MdDiamond className="text-indigo-500" /> Local Store Support with
            Online Convenience
          </li>
          <li className="flex items-center gap-2">
            <MdDiamond className="text-indigo-500" /> Festival Specials, Combos
            & Personalized Gifting
          </li>
        </ul>

        <p className="font-serif text-lg text-justify mt-5 px-10">
          Every order comes with our promise:{" "}
          <em className="text-yellow-700">
            trust, quality, and secure doorstep delivery
          </em>
          . Whether you're buying for yourself, a loved one, or celebrating
          something unforgettable—Thiaworld Jewellery brings timeless elegance
          to everyday life.
        </p>

        <p className="font-serif text-lg  mt-5 px-10 text-center pb-5">
          Found <strong>only on BBSCART.COM</strong> — powered by the trusted
          group <strong>BBSOCEAN Online Shopping</strong>.
        </p>
      </div>
      <Footer />
    </>
  );
}

export default Aboutus;
