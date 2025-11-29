import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AccountMenu = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("bbsUser");
    setUser(null);
    navigate("/login");
    window.dispatchEvent(new Event("storageUpdate"));
  };

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
  }, []);

  return (
    <div className="bg-[#f3f3f3] p-4 rounded-lg w-[90vw] sm:w-[400px] md:w-[500px] lg:w-[500px] max-h-[80vh] overflow-y-auto shadow-lg no-scrollbar">
      {/* Top Profile Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2 mb-3">
        <p className="text-sm text-gray-800">
          Who is shopping?{" "}
          <span className="font-semibold">Select a profile.</span>
        </p>
        <button className="text-blue-600 text-sm text-wrap font-semibold hover:underline mt-2 sm:mt-0">
          Manage Profiles
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        {/* Left: Your Lists */}
        <div>
          <ul className="space-y-1 text-gray-700">
            <li>Shopping List</li>
          </ul>
          <hr className="my-3" />
          <ul className="space-y-1 text-gray-700">
            <li>Create a Wish List</li>
            <li>Wish from Any Website</li>
            <li>Baby Wishlist</li>
            <li>Discover Your Style</li>
            <li>Explore Showroom</li>
          </ul>
        </div>

        {/* Right: Your Account */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Your Account</h3>
          <ul className="space-y-1 text-gray-700">
            <li>Switch Accounts</li>
            <li
              onClick={handleLogout}
            >
              Sign Out
            </li>
            <hr className="my-2" />
            <li>Your Account</li>
            <li>Your Orders</li>
            <li>Keep shopping for</li>
            <li>Your Recommendations</li>
            <li>Your Subscribe & Save Items</li>
            <li>Memberships & Subscriptions</li>
            <li>Your Seller Account</li>
            <li>Content Library</li>
            <li>Devices</li>
            <li>Register free Business Account</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccountMenu;
