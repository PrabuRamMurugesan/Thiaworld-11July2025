import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";
import { GiArchiveRegister } from "react-icons/gi";
import { IoLogoXing } from "react-icons/io";

const AccountPage = () => {
  return (
    <div className="container my-4 text-center text-md-start bg-white p-3 px-5">
      {/* Header Section */}
      <div className="text-center mb-4 d-flex flex-column justify-content-center align-items-center">
        {/* Login & Register Buttons */}
        <div className="d-flex flex-wrap flex-col justify-content-center gap-2 mb-2">
          <Link
            to="/login"
            className="d-flex align-items-center gap-2 px-3 py-2 rounded bg-light justify-content-center text-dark text-decoration-none border border-light shadow-sm w-[400px]"
            style={{ transition: "background 0.3s" }}
          >
            <IoLogoXing size={18} />
            <span className="small fw-semibold">Login</span>
          </Link>

          <Link
            to="/signup"
            className="d-flex align-items-center flex-row rounded bg-light text-dark text-decoration-none border border-light shadow-sm"
          >
          <p  className="d-flex align-items-center gap-1  justify-content-center  text-blue-500 w-[400px]"
            >
          New customer?{" "}
           <div className="d-flex align-items-center gap-2 px-3 py-2 rounded bg-light text-dark text-decoration-none ">
             <GiArchiveRegister size={18} />
            <span className="small fw-semibold">Register</span>
           </div>
           </p>
          </Link>
        </div>
      </div>

      <hr className="my-4" />

      {/* Content Section */}
      <div className="row mt-3 g-4">
        {/* Left Column */}
        <div className="col-12 col-md-6">
          <h6 className="fw-bold text-uppercase small text-secondary mb-3">
            Your Lists
          </h6>
          <ul className="list-unstyled small">
            {[
              "Create a Wish List",
              "Wish from Any Website",
              "Baby Wishlist",
              "Discover Your Style",
              "Explore Showroom",
            ].map((item, idx) => (
              <li key={idx}>
                <a
                  href="#"
                  className="d-block py-1 text-dark text-decoration-none hover:text-primary"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column */}
        <div className="col-12 col-md-6">
          <h6 className="fw-bold text-uppercase small text-secondary mb-3">
            Your Account
          </h6>
          <ul className="list-unstyled small">
            {[
              "Your Account",
              "Your Orders",
              "Your Wish List",
              "Keep shopping for",
              "Your Recommendations",
              "Your Prime Membership",
              "Your Prime Video",
              "Your Subscribe & Save Items",
              "Memberships & Subscriptions",
              "Your Seller Account",
              "Manage Your Content and Devices",
              "Register for a free Business Account",
            ].map((item, idx) => (
              <li key={idx}>
                <a
                  href="#"
                  className="d-block py-1 text-dark text-decoration-none hover:text-primary"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
