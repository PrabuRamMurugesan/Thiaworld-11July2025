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
import { TbJewishStarFilled } from "react-icons/tb";
import { Row, Col, Button } from "react-bootstrap";
import { RiUserSettingsFill } from "react-icons/ri";
import { GiArchiveRegister } from "react-icons/gi";
import { IoLogoXing } from "react-icons/io";
import { useNavigate, Link } from "react-router-dom";
import Select from "react-select";
import thia from "../../public/assets/thia.png";
import bbscart from "../../public/assets/bbscart.png";
import healthAccess from "../../public/assets/healthacess.png";
import { useWishlist } from "../context/WishlistContext";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const { cartCount } = useContext(CartContext);
  const { ids } = useWishlist(); // Set of productIds in wishlist
  const wishlistCount = ids.size;

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

  const timerRef = useRef(null);

  const handleEnter = () => {
    // Cancel any scheduled close
    clearTimeout(timerRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    // Close after 500 ms
    timerRef.current = setTimeout(() => setOpen(false), 500);
  };
  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 ">
        <div className="max-w-screen-xxl  flex flex-row md:flex-row items-center justify-between gap-2 px-4 py-2  ">
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
            className="md:hidden text-amber-300 text-3xl text-bold "
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <TbJewishStarFilled /> : <TbJewishStarFilled />}
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
          <div className="hidden md:flex items-start pb-2 gap-4">
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

          {/* Mobile Menu Overlay */}
          {menuOpen && (
            <div className="md:hidden bg-white w-75 p-4 space-y-4">
              <div className="text-sm text-black overflow-hidden whitespace-nowrap">
                <div className="animate-marquee inline-block">
                  Matte Finish Bangles · 22K Necklaces · Antique Temple Jewelry
                  · Lightweight Gold Chains
                </div>
              </div>
              <div className="relative">
                <FaSearch className="absolute right-3 top-3 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search jewelry, collections, categories..."
                  className="w-full pl-3 pr-8 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                />
              </div>
              <div className="w-full">
                <Select
                  value={selectedOption}
                  onChange={setSelectedOption}
                  options={options}
                  isSearchable={false}
                />
              </div>
            </div>
          )}
        </div>

        {/* NAVBAR WRAPPER */}
        {/* ===== DESKTOP / TABLET NAV ===== */}
        <div
          className="hidden md:flex items-center justify-between px-6 py-3"
          style={{ backgroundColor: "rgba(13,88,102)", color: "white" }}
        >
          {/* LEFT: (optional logo) */}
          <div className="w-1/4 flex items-center"></div>

          {/* CENTER LINKS */}
          <nav className="w-2/4 flex justify-center gap-6 text-sm items-center">
            <Link
              to="/"
              onClick={(e) => {
                e.preventDefault(); // stop the SPA navigation
                window.location.href = "/"; // force full page reload
              }}
              className="hover:underline"
            >
              Home
            </Link>
            <span
              onClick={(e) => {
                e.preventDefault(); // stop default behavior
                navigate("/aboutus"); // React Router navigation
                window.location.reload(); // full page reload after navigation
              }}
              className="cursor-pointer hover:underline"
            >
              About Us
            </span>
            <span
              onClick={(e) => {
                e.preventDefault(); // stop default behavior
                navigate("/thia-secure"); // React Router navigation
                window.location.reload(); // full page reload after navigation
              }}
              className="flex items-center gap-2 cursor-pointer hover:underline"
            >
              <RiSecurePaymentLine />
              Thia-Secure Plan
            </span>
            <span
              onClick={(e) => {
                e.preventDefault();
                navigate("/contact-page");
                window.location.reload();
              }}
              className="cursor-pointer hover:underline"
            >
              Contact
            </span>
          </nav>

          {/* RIGHT: USER + CART */}
          <div className="w-1/4 flex justify-end items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 whitespace-nowrap">
                <span className="font-semibold">
                  Welcome, {user.name || "Profile"}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-800 hover:bg-gray-900 text-white flex items-center gap-2 px-3 py-1 rounded-md text-sm"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            ) : (
              <div
                className="relative"
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                onFocus={handleEnter}
                onBlur={handleLeave}
              >
                <button className="flex items-center text-sm">
                  <FaUserAlt className="mr-2 text-xl" />
                  <span className="hidden sm:inline">Account</span>
                </button>

                {/* Dropdown */}
                {open && (
                  <div className="absolute right-0 mt-2 w-32 bg-white text-black shadow-lg rounded-lg z-50">
                    <Link
                      to="/login"
                      className="flex px-3 py-2 hover:bg-orange-100 rounded-t flex-row items-center gap-2"
                    >
                      <IoLogoXing />
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="flex flex-row items-center gap-2 px-3 py-2 hover:bg-orange-100 rounded-b"
                    >
                      <GiArchiveRegister />
                      Register
                    </Link>
                  </div>
                )}
              </div>
            )}

            <Link
              to="/cart"
              className="relative flex items-center gap-2 hover:text-yellow-300"
            >
              <FaShoppingCart className="text-lg" />
              <span className="hidden sm:inline">Cart</span>
              <span className="absolute -top-2 -right-0 bg-red-500 text-white text-xs rounded-full px-1.5">
                {cartCount}
              </span>
            </Link>
            <Link to="/wishlist" className="relative hover:no-underline">
              <span className="absolute -top-2 -right-0 bg-red-500 text-white text-xs rounded-full px-1.5">
                {wishlistCount}
              </span>
              <span>❤️</span>
            </Link>
            <Link
              to="/user-settings"
              className="relative flex items-center gap-2 hover:text-yellow-300"
            >
              <RiUserSettingsFill className=" text-xl" />
              <span className="hidden sm:inline">User</span>
            </Link>
          </div>
        </div>

        {/* ===== MOBILE NAVBAR ===== */}
        <div
          className="flex md:hidden items-center justify-between px-4 py-3"
          style={{ backgroundColor: "rgba(13,88,102)", color: "white" }}
        >
          {/* Logo placeholder or site name */}
          <div className="text-lg font-semibold">Menu</div>

          {/* Hamburger button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-2xl focus:outline-none"
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile drawer menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[rgba(13,88,102)] text-white flex flex-row flex-wrap justify-between items-end gap-4 px-6 py-4 transition-all duration-300">
            {/* Nav links */}
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="hover:underline"
            >
              Home
            </Link>
            <button
              onClick={() => {
                navigate("/aboutus");
                setMobileOpen(false);
              }}
              className="text-left hover:underline"
            >
              About Us
            </button>
            <button
              onClick={() => {
                navigate("/thia-secure");
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 hover:underline"
            >
              <RiSecurePaymentLine />
              Thia-Secure Plan
            </button>
            <button
              onClick={() => {
                navigate("/contact-page");
                setMobileOpen(false);
              }}
              className="text-left hover:underline"
            >
              Contact
            </button>

            {/* Divider */}
            <hr className="border-gray-300 my-2" />

            {/* User / Auth */}
            {user ? (
              <div className="flex flex-col gap-2">
                <span className="font-semibold">
                  Welcome, {user.name || "Profile"}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="bg-gray-800 hover:bg-gray-900 text-white flex items-center gap-2 px-3 py-1 rounded-md text-sm"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="hover:underline flex flex-row items-center gap-2"
                >
                  <IoLogoXing />
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="hover:underline flex flex-row items-center gap-2"
                >
                  <GiArchiveRegister />
                  Register
                </Link>
              </div>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="relative flex items-center gap-2 hover:text-yellow-300 mt-2"
            >
              <FaShoppingCart className="text-lg" />
              <span>Cart</span>
              <span className="absolute -top-2 left-5 bg-red-500 text-white text-xs rounded-full px-1.5">
                {cartCount}
              </span>
            </Link>

            <Link
              to="/user-settings"
              className="relative flex items-center gap-2 hover:text-yellow-300"
            >
              <RiUserSettingsFill className=" text-xl" />
              <span className="hidden sm:inline">User</span>
            </Link>
          </div>
        )}

        <Row className="mb-3">
          <Col className="d-flex justify-content-center gap-3 mt-3">
            <Button
              variant="outline-secondary"
              size="sm"
              style={{ color: "black" }}
              onClick={() => (window.location.href = "https://bbscart.com/")}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
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
              <span
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
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
    </>
  );
};

export default Header;
