// ✅ FINAL ThiaHomePage.jsx — Updated Best Selling

import React, { useState, useEffect } from "react";
import { AiFillDropboxCircle } from "react-icons/ai";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import HeroVideo from "../components/HeroVideo";
import FeaturedProducts from "../components/FeaturedProducts";
import RecentProducts from "../components/RecentProducts";
import SecurePlanSection from "../components/SecurePlanSection";
import WhyChooseUs from "../components/WhyChooseUs";
import PromoBanner from "../components/PromoBanner";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import axios from "axios";
import AiBox from "../components/AiBox";
import ProductList from "../components/ProductList";
import { useNavigate, Link } from "react-router-dom";
import MainStyles from "../components/MainStyles";
import GoldAdSlider from "../components/Jewellery-page/GoldAdSlider";
import ProductBox from "../components/Jewellery-page/ProductBox";
import ShopByBudget from "../components/Jewellery-page/ShopByBudget";
import HomeProductSection from "../components/HomeProductSection"; // adjust path if needed
import BestSellingProducts from "../components/BestSellingProducts";
import THIAWorldExclusiveStorefrontPage from "./ThaiworldExclusiveStorefrontPage";

const ThiaHomePage = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const toggleChat = () => setIsOpen((prev) => !prev);
  const API = import.meta.env.VITE_API_BASE_URL;

  const [bestSellingProducts, setBestSellingProducts] = useState([]);

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        const res = await axios.get(`${API}/api/products/best-selling`);
        setBestSellingProducts(res.data);
        console.log(res.data, "dsagsgtsgtger");
      } catch (err) {
        console.error("Error fetching best selling products:", err);
      }
    };
    fetchBestSelling();
  }, []);

  return (
    <div className="bg-[#fdfaf6] text-gray-800 font-sans">
      <Header />
      {/* <ProductList /> */}
      <Navbar />
      <GoldAdSlider />
      <MainStyles />

      <HomeProductSection />

      <section className="py-10 px-4 bg-slate-100">
        <h2 className="text-center mb-5 font-serif text-3xl font-bold">
          Thiaworld Exclusive
        </h2>
        <THIAWorldExclusiveStorefrontPage />
      </section>

      {/* ✅ UPDATED Best Selling Section */}
      <section className="py-10 px-4 bg-slate-100">
        <h2 className="text-center mb-5 font-serif text-3xl font-bold">
          Best Selling Products
        </h2>
        <BestSellingProducts />
      </section>

      {/* Featured Collections */}
      <section className="py-10 px-4 bg-[#ffffff]">
        <h2 className="text-center mb-5 font-serif text-3xl font-bold">
          Featured Collections
        </h2>
        <FeaturedProducts />
      </section>

      {/* Recently Added Products */}
      <section className="py-10 px-4 bg-slate-100">
        <h2 className="text-center mb-5 font-serif text-2xl font-bold">
          New Arrivals
        </h2>
        <RecentProducts />
      </section>

      <section className="py-10 px-4 bg-[#ffffff]">
        <ShopByBudget />
      </section>

      <section className="py-10 px-4 bg-[#fdfaf6]">
        <WhyChooseUs />
      </section>

      <section className="py-10 px-4 bg-[#ffffff]">
        <PromoBanner />
      </section>

      <section className="py-10 px-4 bg-[#f8f5f0]">
        <h2 className="text-2xl font-semibold text-center mb-6">
          What Our Customers Say
        </h2>
        <Testimonials />
      </section>

      <div className="fixed bottom-12 right-1 z-50 flex flex-col items-end gap-2">
        {isOpen && (
          <div className="w-[300px] shadow-lg rounded-lg bg-white border border-gray-300">
            <AiBox />
          </div>
        )}
        <button onClick={toggleChat}>
          <img
            src="/assets/chat.png"
            className="text-5xl hover:scale-105 transition-transform p-1 w-[100px] h-[100px]"
          />
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default ThiaHomePage;
