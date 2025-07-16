import React, { useState, useRef, useEffect } from "react";
import { RiSecurePaymentLine } from "react-icons/ri";
import {
  FaHeart,
  FaShoppingCart,
  FaUserAlt,
  FaSearch,
  FaBars,
  FaTimes,
  FaFacebookSquare,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import { BiSolidUserAccount } from "react-icons/bi";
import { FaSquareXTwitter } from "react-icons/fa6";
import ProductDetail from "./ProductDetail";
import { useNavigate, Link } from "react-router-dom";
import Select from "react-select";
import { IoNotifications } from "react-icons/io5";
const options = [
  {
    value: "IN",
    label: (
      <div className="flex items-center gap-2">
        <img
          src="https://flagcdn.com/w40/in.png"
          alt="IN"
          style={{ width: "24px", height: "24px", borderRadius: "50%" }}
        />
        <span>India</span>
      </div>
    ),
  },
  {
    value: "UAE",
    label: (
      <div className="flex items-center gap-2">
        <img
          src="https://flagcdn.com/w40/ae.png"
          alt="UAE"
          style={{ width: "24px", height: "24px", borderRadius: "50%" }}
        />
        <span>UAE</span>
      </div>
    ),
  },
  {
    value: "US",
    label: (
      <div className="flex items-center gap-2">
        <img
          src="https://flagcdn.com/w40/us.png"
          alt="US"
          style={{ width: "24px", height: "24px", borderRadius: "50%" }}
        />
        <span>USA</span>
      </div>
    ),
  },
];
const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, type: "Price Drop", message: "Gold necklace price dropped 5%!" },
    {
      id: 2,
      type: "Restock",
      message: "Earrings you liked are back in stock!",
    },
    { id: 3, type: "Flash Sale", message: "Flash Sale starts in 30 minutes!" },
    { id: 4, type: "Flash Sale", message: "Flash Sale starts in 30 minutes!" },
  ];
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 ">
      <div className="max-w-screen-xxl  flex flex-col md:flex-row items-center justify-between gap-4  ">
        {/* <div className="max-w-screen-xl mx-auto px-4 sm:px-6 flex flex-wrap  items-center justify-between gap-4 py-2"> */}
        {/* Logo */}
        {/* <div className="flex items-center">
          <img
            src="/assets/logo1.png"
            alt="Thiaworld Logo"
            className="max-w-[180px] max-h-[100px]"
          />
        </div> */}
     <h1
  style={{
    fontFamily: "Lucida Handwriting",
    fontSize: "30px",
    padding: "20px",
    textAlign: "center",
    background: "linear-gradient(to right, red, yellow, green)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "1px 1px 1px rgba(0, 0, 0, 0.3)",
  }}
>
          BBSCART
          <p style={{ fontSize: "10px", textAlign: "center", color: "black" }}>
            online shopping
          </p>
        </h1>

        {/* Hamburger for Mobile */}
        <button
          className="md:hidden text-2xl text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Search and Marquee (hidden on small screens) */}
        <div className="hidden md:flex flex-col md:flex-row items-center flex-1 gap-4">
          <div className="text-sm text-black overflow-hidden whitespace-nowrap w-full">
            <div className="animate-marquee inline-block">
              Matte Finish Bangles · 22K Necklaces · Antique Temple Jewelry ·
              Lightweight Gold Chains
            </div>
          </div>

          <div className="relative w-full max-w-md">
            <FaSearch className="absolute right-3 top-3 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search jewelry, collections, categories..."
              className="w-full pl-3 pr-8 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            />
          </div>
        </div>

        {/* Right icons */}
        <div className="hidden md:flex items-center gap-4">
          <button className="relative text-gray-600 hover:text-red-500">
            <FaHeart className="text-xl" />
          </button>

          <button className="relative text-gray-600 hover:text-yellow-600">
            <FaShoppingCart className="text-xl" />
            <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full px-1">
              1
            </span>
          </button>

         <a href="">
           <button className="text-sm text-gray-700 hover:text-yellow-600 flex items-center">
            <FaUserAlt className="mr-2 text-xl" />
            Login
          </button>
         </a>

          <div style={{ width: "90px", height: "30px", border: "none" }}>
            <Select
              value={selectedOption}
              onChange={setSelectedOption}
              options={options}
              isSearchable={false}
            />
          </div>
        </div>
        <ProductDetail />
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            />
            <div className="flex gap-6 justify-around">
              <button onClick={() => navigate("/")}>Home</button>
              <button>About</button>
              <button onClick={() => navigate("/contact-page")}>Contact</button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <div
        className="hidden md:flex justify-between items-center p-3 "
        style={{ backgroundColor: "rgba(13,88,102)", color: "white" }}
      >
        <div className="w-1/3" />

        <div className="d-flex flex-row flex justify-center align-items-center column-gap-4 w-100 ">
          <span onClick={() => navigate("/")} className="cursor-pointer">
            Home
          </span>
          <span onClick={() => navigate("/aboutus")} className="cursor-pointer">
            {" "}
            About Us
          </span>
          <span
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/thia-secure")}
          >
            <RiSecurePaymentLine />
            Thia-Secure Plan
          </span>
          <span
            onClick={() => navigate("/contact-page")}
            className="cursor-pointer"
          >
            Contact
          </span>

          <Link to="/goldrate" className="  ">
            Admin
          </Link>
        </div>

        <div className="w-full md:w-1/3 flex justify-center md:justify-end px-4">
          <a href="" target="_blank" rel="noreferrer">
            <span className="px-3">More Pro </span>
          </a>
          <Link
            to="/cart"
            className="flex items-center gap-1 text-white hover:text-yellow-300 relative"
          >
            <FaShoppingCart className="text-lg" />
            <span className="">Cart</span>
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1">
              0
            </span>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-end px-5 gap-2 p-2   ">
        <div className="flex items-center gap-5 justify-between">
          <div className="flex items-center   gap-2">
            <div
              style={{ position: "relative", display: "inline-block" }}
              ref={dropdownRef}
            >
              {/* Icon Button */}
              <button
                onClick={() => setOpen(!open)}
                style={{
                  color: "orange",
                  padding: "2px ",
                  borderRadius: "4px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "30px",

                  fontSize: "18px",
                }}
                title="Notifications"
              >
                <IoNotifications size={18} />
              </button>

              {/* Dropdown Box */}
              {open && (
                <div
                  style={{
                    position: "absolute",
                    top: "34px",
                    left: "-60px",
                    width: "220px",
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    zIndex: 9999,
                    padding: "10px",
                    maxHeight: "250px",
                    overflowY: "auto",
                    scrollbarWidth: "thin", // For Firefox
                    WebkitOverflowScrolling: "touch", // For smoother scrolling on mobile
                  }}
                >
                  <h6
                    style={{
                      marginBottom: "10px",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "bold",
                      borderBottom: "1px solid #ccc",
                      paddingBottom: "5px",
                    }}
                  >
                    Notifications & Alerts
                  </h6>

                  {notifications.length === 0 ? (
                    <p style={{ fontSize: "14px" }}>No new notifications</p>
                  ) : (
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {notifications.map((note) => (
                        <li
                          key={note.id}
                          style={{ margin: "9px 10px", fontSize: "12px" }}
                        >
                          <strong>{note.type}:</strong> {note.message}
                        </li>
                      ))}
                    </ul>
                  )}

                  <a
                    href="/notifications"
                    style={{
                      display: "block",
                      textAlign: "center",
                      marginTop: "10px",
                      fontSize: "14px",
                      color: "#007bff",
                      textDecoration: "none",
                      cursor: "pointer", 
                  
                      
                    }}
                  >
                    View All Alerts
                  </a>
                </div>
              )}
            </div>

            <a
              href="/account-settings"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "black",
                color: "white",
                padding: "2px",
                borderRadius: "4px",
                textDecoration: "none",
                height: "18px",
                width: "18px",
              }}
            >
              <BiSolidUserAccount size={18} />
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(24, 119, 242, 1)", // Facebook blue
                color: "white",
                padding: "2px",
                borderRadius: "4px",
                textDecoration: "none",
                height: "18px",
                width: "18px",
              }}
            >
              <FaFacebookSquare size={18} />
            </a>

            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(45deg, rgba(245, 133, 41, 1), rgba(221, 42, 123, 1), rgba(129, 52, 175, 1), rgba(81, 91, 212, 1))",
                color: "white",
                padding: "2px",
                borderRadius: "4px",
                textDecoration: "none",
                height: "18px",
                width: "18px",
              }}
            >
              <FaInstagram size={18} />
            </a>

            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 1)",
                padding: "0px",
                borderRadius: "4px",
                textDecoration: "none",
                // padding: "2px",
                height: "18px",
                width: "18px",
              }}
            >
              <FaSquareXTwitter size={18} />
            </a>

            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(10, 102, 194, 1)", // LinkedIn blue
                color: "white",
                padding: "2px",
                borderRadius: "4px",
                textDecoration: "none",
                height: "18px",
                width: "18px",
              }}
            >
              <FaLinkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
