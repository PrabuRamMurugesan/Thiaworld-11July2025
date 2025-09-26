import React from 'react';
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoIosCall } from "react-icons/io";

const Footer = () => {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#000000e5] text-white border-t border-gray-200 py-10 mt-10">
      <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* 1. Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/aboutus" className="hover:text-yellow-600">
                About Thiaworld
              </a>
            </li>
            <li>
              <a href="/thia-secure" className="hover:text-yellow-600">
                Thia Secure Plan
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-600">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-600">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* 2. Newsletter Signup */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Subscribe</h4>
          <p className="text-sm mb-3">
            Get exclusive updates and offers on your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none text-sm flex-1"
            />
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* 3. Social & Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Connect With Us</h4>
          <div className="flex space-x-4 mb-4">
            <a
              href="https://www.facebook.com/profile.php?id=100090804256179"
              className="text-gray-600 hover:text-yellow-600"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/bbscart/?hl=en#"
              className="text-gray-600 hover:text-yellow-600"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.youtube.com/channel/UCNiBeRvAW1bQOUEcaqc0hYA"
              className="text-gray-600 hover:text-yellow-600"
            >
              <FaYoutube />
            </a>
          </div>
          <span className="w-[25px] basis-[auto] grow-[0] shrink-[0]">
            <i className="ri-phone-fill leading-[0] text-[18px] text-primary"></i>
          </span>
          <Link
            to="tel:04132915916"
            target="_blank"
            className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-secondary inline-block relative break-all tracking-[0] font-normal max-[1399px]:text-[15px] max-[1199px]:text-[14px]"
          >
            <IoIosCall />0413 291 5916
          </Link>
          <p className="text-sm">📧 support@thiaworld.com</p>
          <p className="text-sm">
            📍 Floor, 1st, 5, 2nd, Cross, Bharathy Street, extension
            Ellaipillaichavady, Anna Nagar, Puducherry, 605005
          </p>
        </div>
      </div>

      {/* Back to Top Button */}
      <div className="mt-10 text-center">
        <button
          onClick={handleBackToTop}
          className="text-sm text-yellow-600 hover:underline"
        >
          ⬆ Back to Top
        </button>
      </div>

      {/* Bottom Note */}
      <div className="text-center text-xs text-gray-500 mt-6">
        © {new Date().getFullYear()} Thiaworld. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
