import React, { useState, useRef, useEffect, useContext } from "react";
import { RiSecurePaymentLine } from "react-icons/ri";
import {
  FaHeart,
  FaShoppingCart,
  FaUserAlt,
  FaSearch,
  FaBars,
  FaTimes,
  FaSignOutAlt,
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
import { CartContext } from "../context/CartContext"; // adjust path if different

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
const { cartCount } = useContext(CartContext);

  const [user, setUser] = useState(null);
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
            style={{ width: "70px", height: "70px" }}
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

      {/* NAVBAR WRAPPER */}
      <div
        className="hidden md:flex items-center justify-between px-6 py-3"
        style={{ backgroundColor: "rgba(13,88,102)", color: "white" }}
      >
        {/* LEFT: Logo (optional, or leave empty space) */}
        <div className="w-1/4 flex items-center"></div>

        {/* CENTER: NAV LINKS */}
        <div className="w-2/4 flex justify-center">
          <nav className="flex gap-6 text-sm items-center">
            <a href="/" className="cursor-pointer hover:underline">
              Home
            </a>

            <span
              onClick={() => navigate("/aboutus")}
              className="cursor-pointer hover:underline"
            >
              About Us
            </span>
            <span
              className="flex items-center gap-2 cursor-pointer hover:underline"
              onClick={() => navigate("/thia-secure")}
            >
              <RiSecurePaymentLine />
              Thia-Secure Plan
            </span>
            <span
              onClick={() => navigate("/contact-page")}
              className="cursor-pointer hover:underline"
            >
              Contact
            </span>
          </nav>
        </div>

        {/* RIGHT: USER + CART */}
        <div className="w-1/4 flex justify-end items-center gap-4">
          {/* RIGHT: USER + CART */}
          <div className="w-1/4 flex justify-end items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 whitespace-nowrap">
                <span className="text-white font-semibold">
                  Welcome, {user.name || "Profile"}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-800 hover:bg-gray-900 text-white flex items-center gap-2 px-3 py-1 rounded-md text-sm"
                >
                  <FaSignOutAlt className="text-white text-base" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="relative group">
                {/* User Icon */}
                <button className="text-sm text-gray-700 flex items-center">
                  <FaUserAlt className="mr-2 text-xl" />
                  <span className="hidden sm:inline">Account</span>
                </button>

                {/* Hover Dropdown */}
                <div className="absolute right-0 mt-2 w-32 bg-white text-black shadow-lg rounded-lg hidden group-hover:block z-50">
                  <Link
                    to="/login"
                    className="block px-3 py-2 hover:bg-orange-100 rounded-t"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 hover:bg-orange-100 rounded-b"
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}

            <Link
              to="/cart"
              className="relative flex items-center gap-2 text-white hover:text-yellow-300"
            >
              <FaShoppingCart className="text-lg" />
              <span className="hidden sm:inline">Cart</span>
              <span className="absolute -top-2 -right-0 bg-red-500 text-white text-xs rounded-full px-1.5">
                {cartCount}
              </span>
            </Link>
          </div>
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
