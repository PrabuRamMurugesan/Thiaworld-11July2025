import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoIosCall } from "react-icons/io";
import logo from "../../public/assets/thiaworld.png";

const Footer = () => {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#000000e5] text-white border-t border-gray-200 py-12 mt-10 ">
      <div className="px-6 sm:px-6 lg:px-8">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 text-left">
          {/* Logo */}
          <div className="flex flex-col items-start text-left">
            <img src={logo} alt="logo" sizes="180" />
          </div>

          {/* Quick Links */}
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

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Subscribe</h4>
            <p className="text-sm mb-3">
              Get exclusive updates and offers in your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Gold Info */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Gold Jewellery Info</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <strong>Purity:</strong> 18K, 22K, 24K Hallmarked
              </li>
              <li>
                <strong>Care:</strong> Store safely, avoid chemicals
              </li>
              <li>
                <strong>Buyback:</strong> Full value & transparent
              </li>
              <li>
                <strong>Occasions:</strong> Bridal & festive collection
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Connect With Us</h4>

            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-blue-600 hover:text-yellow-600">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-pink-500 hover:text-yellow-600">
                <FaInstagram size={22} />
              </a>
              <a href="#" className="text-red-600 hover:text-yellow-600">
                <FaYoutube size={25} />
              </a>
            </div>

            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-300">
              <IoIosCall className="text-lg text-yellow-500" />
              <Link
                to="tel:04132915916"
                className="text-sm hover:text-yellow-600"
              >
                0413 291 5916
              </Link>
            </div>

            <p className="text-sm mt-2">📧 support@thiaworld.com</p>
            <p className="text-sm">
              📍 Floor 1, 5, 2nd Cross, Bharathy Street, Puducherry – 605005
            </p>
          </div>
        </div>

        <div className="text-center">
          {/* Back to Top */}
          <div className="mt-10">
            <button
              onClick={handleBackToTop}
              className="text-sm text-yellow-600 hover:underline "
            >
              ⬆ Back to Top
            </button>
          </div>

          {/* Copyright */}
          <div className="text-[10px] sm:text-xs text-gray-500 mt-6">
            © {new Date().getFullYear()} Thiaworld. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
