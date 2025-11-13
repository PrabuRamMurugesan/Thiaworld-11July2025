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
import { IoIosHeart } from "react-icons/io";
import { CartContext } from "../context/CartContext"; // adjust path if different
import AccountSettingsPage from "../pages/AccountSettingsPage";
import AccountPage from "./AccountPage";
import AccountMenu from "./AccountMenu";
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
            <a href="/">
              <img
                src={thia}
                alt="Thiaworld"
                style={{ width: "90px", height: "70px" }}
              />
            </a>
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
          className="hidden md:flex items-center justify-between px-6 py-3 button-83"
          // style={{ backgroundColor: "rgb(194, 120, 20)", color: "white" }}
        >
          {/* LEFT: (optional logo) */}
          <div className="w-1/4 flex items-center"></div>

          {/* CENTER LINKS */}
          <nav className="w-2/4 flex justify-center gap-6 text-sm items-center flex-wrap ">
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
              className="cursor-pointer hover:underline text-nowrap"
            >
              About Us
            </span>
            <span
              onClick={(e) => {
                e.preventDefault(); // stop default behavior
                navigate("/thia-secure"); // React Router navigation
                window.location.reload(); // full page reload after navigation
              }}
              className="flex items-center gap-2 cursor-pointer hover:underline text-nowrap"
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
          <div className="w-1/3 flex justify-end items-center gap-3 relative">
            {user ? (
              <div
                className="relative flex flex-row items-center justify-center gap-2 whitespace-nowrap text-decoration-none"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                {/* Welcome Text */}
                <div className="flex flex-col  items-start justify-start whitespace-nowrap text-decoration-none cursor-pointer">
                  <span className="font-semibold text-white  flex flex-wrap text-xs">
                    Welcome
                  </span>
                  <span className="font-semibold text-opacity-10 flex flex-wrap text-xs ">
                    {user.name || "Profile"}
                  </span>
                </div>

                {/* Dropdown / Option Box */}
                {open && (
                  <div className="absolute right-22 top-[1.5rem] mt-2 bg-white text-black shadow-lg rounded-lg z-50 w-[250px] sm:w-[300px] md:w-[500px] max-h-[80vh] overflow-y-auto no-scrollbar transition-all duration-200">
                    <AccountMenu />
                  </div>
                )}
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
                  <div
                    className="p-2 top-[1.5rem] mt-2 bg-white text-black shadow-lg rounded-lg z-50 w-[250px] sm:w-[300px] md:w-[450px] max-h-[80vh] overflow-y-auto no-scrollbar transition-all duration-200"
                    style={{
                      position: "absolute",
                      right: "-12.8rem",
                    }}
                  >
                    {/* Login / Signup Section */}
                    <AccountPage />
                  </div>
                )}
              </div>
            )}

            <Link
              to="/cart"
              className="relative flex items-center gap-2 hover:text-yellow-300 text-decoration-none"
            >
              <FaShoppingCart className="text-lg" />
              <span className="hidden sm:inline">Cart</span>
              <span className="absolute -top-2 -right-0 bg-red-500 text-white text-xs rounded-full px-1.5">
                {cartCount}
              </span>
            </Link>
            <Link to="/wishlist" className="relative hover:no-underline">
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 text-decoration-none">
                {wishlistCount}
              </span>
              <span className="text-decoration-none text-red-600">
                <IoIosHeart size={20} />
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
          <div
            className="md:hidden bg-[rgba(13,88,102)] text-white flex flex-row flex-wrap
           justify-between items-end gap-4 px-6 py-4 transition-all duration-300"
          >
            {/* Nav links */}
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="hover:underline text-nowrap"
            >
              Home
            </Link>
            <button
              onClick={() => {
                navigate("/aboutus");
                setMobileOpen(false);
              }}
              className="text-left hover:underline text-nowrap"
            >
              About Us
            </button>
            <button
              onClick={() => {
                navigate("/thia-secure");
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 hover:underline text-nowrap"
            >
              <RiSecurePaymentLine />
              Thia-Secure Plan
            </button>
            <button
              onClick={() => {
                navigate("/contact-page");
                setMobileOpen(false);
              }}
              className="text-left hover:underline text-nowrap"
            >
              Contact
            </button>

            {/* Divider */}
            <hr className="border-gray-300 my-2" />
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

            {/* User / Auth */}
            {user ? (
              <div
                className="relative flex flex-row items-center justify-center gap-2 whitespace-nowrap text-decoration-none"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                <div className="flex flex-row gap-2 items-start justify-start whitespace-nowrap text-decoration-none cursor-pointer">
                  <span className="font-semibold text-white  flex flex-wrap text-xs">
                    Welcome
                  </span>
                  <span className="font-semibold text-opacity-10 flex flex-wrap text-xs ">
                    {user.name || "Profile"}
                  </span>
                </div>
                {open && (
                  <div
                    className="absolute right-10 left-[-5rem] sm:left-[-15rem] md:left-[20rem] top-[0.6rem] mt-2 bg-white text-black shadow-lg rounded-lg z-50 
                  w-[300px] sm:w-[400px] md:w-[400px] max-h-[60vh] overflow-y-auto no-scrollbar transition-all duration-200"
                  >
                    <AccountMenu />
                  </div>
                )}
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
                  <div
                    className="absolute right-10 left-[-5rem] sm:left-[-15rem] md:left-[20rem] top-[0.6rem] mt-2 bg-white text-black shadow-lg rounded-lg z-50 
                  w-[300px] sm:w-[400px] md:w-[400px] max-h-[60vh] overflow-y-auto no-scrollbar transition-all duration-200"
                  >
                    {/* Login / Signup Section */}
                    <AccountPage />
                  </div>
                )}
              </div>
            )}

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
              className="border-1 border-r-red-600 border-l-red-900 border-rose-700  rounded-t-xl px-3"
              variant="none"
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
              className="border-r-cyan-600 border-l-cyan-900 border-cyan-700 border-1 rounded-b-xl px-3"
              variant="none"
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
      <style>
        {`
        /* Hide scrollbar but allow scrolling */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;     /* Firefox */
}

/* CSS */
.button-83 {
  appearance: button;
  background-color: transparent;
  background-image: linear-gradient(to bottom, #DEDEDE, #f8eedb);
  border: 0 solid #e5e7eb;
 
  box-sizing: border-box;
  color: #482307;
  column-gap: 1rem;
  cursor: pointer;
  display: flex;
  font-family: ui-sans-serif,system-ui,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  font-size: 100%;
  font-weight: 700;
  line-height: 24px;
  margin: 0;
  outline: 2px solid transparent;
  padding: 1rem 1.5rem;
  text-align: center;
  text-transform: none;
  transition: all .1s cubic-bezier(.4, 0, .2, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  box-shadow: -6px 8px 10px rgba(81,41,10,0.1),0px 2px 2px rgba(81,41,10,0.2);
}

.button-83:active {
  background-color: #f3f4f6;
  box-shadow: -1px 2px 5px rgba(81,41,10,0.15),0px 1px 1px rgba(81,41,10,0.15);
  transform: translateY(0.125rem);
}

.button-83:focus {
  box-shadow: rgba(72, 35, 7, .46) 0 0 0 4px, -6px 8px 10px rgba(81,41,10,0.1), 0px 2px 2px rgba(81,41,10,0.2);
}
`}
      </style>
    </>
  );
};

export default Header;
