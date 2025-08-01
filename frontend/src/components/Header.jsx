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
import { Row, Col, Button } from "react-bootstrap";
import { BiSolidUserAccount } from "react-icons/bi";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useNavigate, Link } from "react-router-dom";
import Select from "react-select";
import { IoNotifications } from "react-icons/io5";
import thia from "../../public/assets/thia.png";
import bbscart from "../../public/assets/bbscart.png";
import healthAccess from "../../public/assets/healthacess.png";

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

  const [user, setUser] = useState(null);

  // Load user on mount and listen for changes
  useEffect(() => {
    const storedUser = localStorage.getItem("bbsUser");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed.user || parsed);
      } catch (err) {
        console.error("Invalid user data in localStorage", err);
      }
    }

    const handleStorageUpdate = () => {
      const updatedUser = localStorage.getItem("bbsUser");
      if (updatedUser) {
        const parsed = JSON.parse(updatedUser);
        setUser(parsed.user || parsed);
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storageUpdate", handleStorageUpdate);
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("storageUpdate", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("bbsUser");
    setUser(null);
    navigate("/login");
    window.dispatchEvent(new Event("storageUpdate"));
  };

  // Close notification dropdown if clicked outside
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
          <img
            src={thia}
            alt="Thiaworld"
            style={{ width: "80px", height: "80px" }}
          />
        </h1>

        <button
          className="md:hidden text-2xl text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

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

          {/* --- Show login or profile/logout --- */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-semibold">
                {user.name || "Profile"}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-2 py-1 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="text-sm text-gray-700 hover:text-yellow-600 flex items-center"
              onClick={() => navigate("/login")}
            >
              <FaUserAlt className="mr-2 text-xl" />
              Login
            </button>
          )}

          <div
            style={{
              width: "90px",
              height: "30px",
              border: "none",
              marginRight: "20px",
            }}
          >
            <Select
              value={selectedOption}
              onChange={setSelectedOption}
              options={options}
              isSearchable={false}
            />
          </div>
        </div>
      </div>

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

      <Row className="mb-3">
        <Col className="d-flex justify-content-center gap-3 mt-3">
          <Button
            variant="outline-secondary"
            size="sm"
            style={{ color: "black" }}
            onClick={() => (window.location.href = "https://bbscart.com/")}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img
                src={bbscart}
                alt="BBSCart"
                style={{ height: "30px", objectFit: "contain" }}
              />
              BBSCart Online Shopping
            </span>
          </Button>

          <Button
            variant="outline-secondary"
            size="sm"
            style={{ color: "black" }}
            onClick={() =>
              (window.location.href = "http://healthcare.bbscart.com/")
            }
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img
                src={healthAccess}
                alt="HealthAccess"
                style={{ height: "30px", objectFit: "contain" }}
              />
              BBS Global Health Access
            </span>
          </Button>
        </Col>
      </Row>
    </header>
  );
};

export default Header;
