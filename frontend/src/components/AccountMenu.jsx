import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AccountMenu = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

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
    <div className="bg-[#f3f3f3] p-4 rounded-lg w-[90vw] sm:w-[400px] md:w-[500px] max-h-[80vh] overflow-y-auto shadow-lg no-scrollbar">

      <div className="flex justify-between items-center border-b pb-2 mb-3">
        <p className="text-sm text-gray-800">
          Who is shopping? <span className="font-semibold">Select a profile.</span>
        </p>
        {/* <button
          onClick={() => navigateTo("/manage-profiles")}
          className="text-blue-600 text-sm font-semibold hover:underline"
        >
          Manage Profiles
        </button> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">

        {/* LEFT COLUMN */}
        <div>
          {/* <ul className="space-y-2 text-gray-700">
            <li>
              <button onClick={() => navigateTo("/shopping-list")}>
                Shopping List
              </button>
            </li>
          </ul> */}

          <hr className="my-3" />

          <ul className="space-y-2 text-gray-700">
            <li><button onClick={() => navigateTo("/wishlist")}>Create a Wish List</button></li>
            <li><button onClick={() => navigateTo("/cart")}>My Cart</button></li>
            <li><button onClick={() => navigateTo("/thia-secure")}>Thia Secure Plan</button></li>
            {/* <li><button onClick={() => navigateTo("/discover-style")}>Discover Your Style</button></li> */}
            {/* <li><button onClick={() => navigateTo("/showroom")}>Explore Showroom</button></li> */}
          </ul>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <ul className="space-y-2 text-gray-700">
            {/* <li><button onClick={() => navigateTo("/switch-accounts")}>Switch Accounts</button></li> */}

            <li>
              <button onClick={handleLogout} className="text-red-600 font-semibold">
                Sign Out
              </button>
            </li>

            <hr className="my-2" />
            <li><button onClick={() => navigateTo("/user-settings")}>User Settings</button></li>
            <li><button onClick={() => navigateTo("/account-settings")}>Account Settings</button></li>
            <li><button onClick={() => navigateTo("/contact-page")}>Support</button></li>
            {/* <li><button onClick={() => navigateTo("/recommendations")}>Your Recommendations</button></li> */}
            {/* <li><button onClick={() => navigateTo("/subscriptions")}>Memberships & Subscriptions</button></li> */}
            {/* <li><button onClick={() => navigateTo("/content-library")}>Content Library</button></li>
            <li><button onClick={() => navigateTo("/devices")}>Devices</button></li> */}
            {/* <li><button onClick={() => navigateTo("/business-account")}>Register free Business Account</button></li> */}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default AccountMenu;
