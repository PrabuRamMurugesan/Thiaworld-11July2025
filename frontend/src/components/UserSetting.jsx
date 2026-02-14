import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

const UserSetting = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    tier: "",
    addresses: [],
    paymentMethods: [],
    profileImage: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("bbsUser");

    if (!stored) {
      navigate("/login");
      return;
    }

    try {
      const parsed = JSON.parse(stored);

      setUser({
        name: parsed?.user?.name || "User",
        email: parsed?.user?.email || "",
        phone: parsed?.user?.phone || "",
        tier: parsed?.user?.tier || "Gold Tier",
        addresses: parsed?.user?.addresses || [],
        paymentMethods: parsed?.user?.paymentMethods || [],
        profileImage: parsed?.user?.profileImage || "",
      });

      setLoading(false);
    } catch (err) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const refreshFromDB = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("bbsUser"));
        if (!stored || !stored.token) return;

        const res = await axios.get(`${import.meta.env.VITE_API_URI}/auth/me`, {
          headers: { Authorization: `Bearer ${stored.token}` },
        });

        const data = res.data;

        const updatedUser = {
          name: data.name,
          email: data.email,
          phone: data.phone,
            tier: data.tier || "Gold Tier",
          addresses: data.addresses || user.addresses,
          paymentMethods: data.paymentMethods || user.paymentMethods,
          profileImage: data.profileImage || user.profileImage,
          profileImage: data.profileImage || user.profileImage,
        };

        setUser(updatedUser);

        stored.user = updatedUser;
        localStorage.setItem("bbsUser", JSON.stringify(stored));
      } catch (err) {
        console.log("DB refresh failed:", err);
      }
    };

    refreshFromDB();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("bbsUser");
    navigate("/login");
  };
const handleDeleteAccount = async () => {
  if (
    !window.confirm(
      "Are you sure you want to delete this account from this device?"
    )
  )
    return;

  try {
    const stored = JSON.parse(localStorage.getItem("bbsUser"));
    await axios.put(
      `${import.meta.env.VITE_API_URI}/auth/deactivate`,
      {},
      { headers: { Authorization: `Bearer ${stored?.token}` } }
    );

    // Remove only local session – DO NOT TOUCH DB
    localStorage.removeItem("bbsUser");

    alert("Account removed from this device");
    navigate("/login");
  } catch (err) {
    console.error(err);
    alert("Failed to delete account");
  }
};



  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="w-full min-h-screen bg-[#f6f6f6]">
        {/* PROFILE HEADER */}
        <div className="w-full  p-2 flex items-center gap-4">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#f4c542] flex items-center justify-center text-gray-500 font-bold">
              {user.name.charAt(0)}
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-700">{user.tier}</p>
          </div>

          <button
            onClick={() => navigate("/edit-profile")}
            className="ml-auto px-4 py-2 bg-black text-white rounded-md"
          >
            Edit Profile
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* QUICK CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* <div
              className="bg-white p-4 rounded shadow text-center cursor-pointer"
              onClick={() => navigate("/orders")}
            >
              Orders
            </div>

            <div
              className="bg-white p-4 rounded shadow text-center cursor-pointer"
              onClick={() => navigate("/wishlist")}
            >
              Wishlist
            </div> */}

            {/* <div
              className="bg-white p-4 rounded shadow text-center cursor-pointer"
              onClick={() => navigate("/rewards")}
            >
              Rewards
            </div>

            <div
              className="bg-white p-4 rounded shadow text-center cursor-pointer"
              onClick={() => navigate("/subscriptions")}
            >
              Subscriptions
            </div> */}
          </div>

          {/* ACCOUNT */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Account</h3>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone || "Not added"}</p>
          </div>

          {/* ADDRESSES */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Addresses</h3>

            {user.addresses.length === 0 && (
              <p className="text-sm text-gray-600">No addresses added.</p>
            )}

            {user.addresses.map((addr, index) => (
              <div
                key={index}
                className="mb-3 flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-semibold">{addr.label || "Address"}</p>
                  <p className="text-sm text-gray-600">
                    {addr.address}, {addr.city}, {addr.state}, {addr.pincode},{" "}
                    {addr.country}
                  </p>
                </div>
                <button
                  className="text-blue-600"
                  onClick={() => navigate(`/edit-address/${addr.id}`)}
                >
                  Edit
                </button>
              </div>
            ))}

            <button
              className="w-full bg-teal-100 text-teal-700 p-2 rounded mt-2"
              onClick={() => navigate("/add-address")}
            >
              + Add Address
            </button>
          </div>

          {/* PAYMENT METHODS */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Payment Methods</h3>

            {user.paymentMethods.length === 0 && (
              <p className="text-sm text-gray-600">No payment methods saved.</p>
            )}

            {user.paymentMethods.map((pm, index) => (
              <div
                key={index}
                className="mb-3 flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-semibold">{pm.type}</p>
                  <p className="text-sm text-gray-600">
                    {pm.type === "UPI"
                      ? pm.upiId
                      : `**** **** **** ${pm.cardNumber?.slice(-4)} (${
                          pm.name
                        })`}
                  </p>
                </div>

                <button
                  className="text-blue-600"
                  onClick={() => navigate(`/edit-payment/${pm.id}`)}
                >
                  Edit
                </button>
              </div>
            ))}

            <button
              className="w-full bg-teal-100 text-teal-700 p-2 rounded mt-2"
              onClick={() => navigate("/add-payment")}
            >
              + Add Payment Method
            </button>
          </div>

          {/* PREFERENCES */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-3">Preferences</h3>

            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked /> Push Notifications
              </label>

              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked /> Email Notifications
              </label>

              <label className="flex items-center gap-3">
                <input type="checkbox" /> SMS Notifications
              </label>

              <label className="flex items-center gap-3">
                <input type="checkbox" /> Dark Theme
              </label>
            </div>
          </div>

          {/* SUPPORT */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Support</h3>

            <div className="mt-3 space-y-2">
              {/* <button className="block text-blue-600">Help & FAQ</button> */}
              <button
                className="block text-blue-600"
                onClick={() => navigate("/contact-page")}
              >
                Contact Support
              </button>
              {/* <button className="block text-blue-600">
                Feedback / Rate App
              </button> */}
            </div>
          </div>

          {/* ACCOUNT ACTIONS */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Account Actions</h3>
            <button onClick={handleLogout} className="block text-red-600 mt-3">
              Logout
            </button>
            <button
              className="block text-red-600 mt-2"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSetting;
