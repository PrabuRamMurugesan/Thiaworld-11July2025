// ProfileSettings.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";

// Mock initial user data
const initialUserData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 9876543210",
  tier: "Gold",
  profilePic: "",
  addresses: [
    {
      id: "1",
      label: "Home",
      address: "123 Main St",
      city: "City",
      state: "State",
      pincode: "123456",
      country: "India",
    },
    {
      id: "2",
      label: "Work",
      address: "456 Office Rd",
      city: "City",
      state: "State",
      pincode: "654321",
      country: "India",
    },
  ],
  paymentMethods: [
    {
      id: "1",
      type: "Card",
      cardNumber: "**** **** **** 1234",
      name: "John Doe",
      expiry: "12/25",
      cvv: "123",
    },
    { id: "2", type: "UPI", upiId: "john@upi" },
  ],
  notifications: { push: true, email: true, sms: false },
};
const handleProfilePicChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const previewUrl = URL.createObjectURL(file);
  setUser((prev) => ({ ...prev, profilePic: previewUrl }));

  // Revoke old preview to free memory
  return () => URL.revokeObjectURL(previewUrl);
};

const ProfileSettings = () => {
  const [user, setUser] = useState(initialUserData);
  const [profile, setProfile] = useState({
    name: initialUserData.name,
    email: initialUserData.email,
    phone: initialUserData.phone,
  });
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(
    initialUserData.notifications
  );
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [addressModal, setAddressModal] = useState({
    open: false,
    editItem: null,
  });
  const [paymentModal, setPaymentModal] = useState({
    open: false,
    editItem: null,
  });

  // Toggle notification
  const toggleNotification = (type) =>
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));

  // Validate profile fields
  const validateProfile = () => {
    if (!profile.name.trim()) return "Name is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) return "Valid email required";
    const phoneRegex = /^[\d+\-\s]{10,15}$/;
    if (!phoneRegex.test(profile.phone)) return "Valid phone required";
    return null;
  };
  // --- inside ProfileSettings component ---

  // Load saved profile if you want persistence across refresh
  React.useEffect(() => {
    const saved = localStorage.getItem("profileSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      setProfile({
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
      });
    }
  }, []);

  const handleSaveProfile = () => {
    const error = validateProfile();
    if (error) {
      alert(error); // show simple popup instead of redirect
      return;
    }

    // Update user state
    setUser((prev) => ({ ...prev, ...profile }));
    setEditProfileOpen(false);

    // Optional: persist to localStorage so refresh keeps changes
    localStorage.setItem(
      "profileSettings",
      JSON.stringify({ ...user, ...profile })
    );
  };

  const handleAction = (action) => {
    const actionLinks = {
      Orders: "/orders",
      Wishlist: "/wishlist",
      Rewards: "/rewards",
      Subscriptions: "/subscriptions",
      "Change Password": "/change-password",
      "Setup Biometric Login": "/biometric-setup",
      "Help & FAQ": "/help",
      "Contact Support": "/contact-support",
      "Feedback / Rate App": "/feedback",
      Logout: "/logout",
      "Delete Account": "/delete-account",
    };
    window.location.href = actionLinks[action] || "/";
  };

  // Address save
  const handleSaveAddress = (item) => {
    if (
      !item.label ||
      !item.address ||
      !item.city ||
      !item.state ||
      !item.pincode ||
      !item.country
    ) {
      window.location.href = "/error?msg=All address fields are required";
      return;
    }
    if (item.id) {
      setUser((prev) => ({
        ...prev,
        addresses: prev.addresses.map((a) => (a.id === item.id ? item : a)),
      }));
    } else {
      setUser((prev) => ({
        ...prev,
        addresses: [...prev.addresses, { ...item, id: Date.now().toString() }],
      }));
    }
    setAddressModal({ open: false, editItem: null });
  };

  // Payment save
  const handleSavePayment = (item) => {
    if (item.type === "Card") {
      if (!item.cardNumber || !item.name || !item.expiry || !item.cvv) {
        window.location.href = "/error?msg=All card fields are required";
        return;
      }
    } else if (item.type === "UPI") {
      if (!item.upiId) {
        window.location.href = "/error?msg=UPI ID is required";
        return;
      }
    }

    if (item.id) {
      setUser((prev) => ({
        ...prev,
        paymentMethods: prev.paymentMethods.map((p) =>
          p.id === item.id ? item : p
        ),
      }));
    } else {
      setUser((prev) => ({
        ...prev,
        paymentMethods: [
          ...prev.paymentMethods,
          { ...item, id: Date.now().toString() },
        ],
      }));
    }
    setPaymentModal({ open: false, editItem: null });
  };

  return (
    <div
      className={`min-h-screen p-4 md:p-8 ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100"
      }`}
    >
      <ProfileHeader user={user} onEdit={() => setEditProfileOpen(true)} />

      {editProfileOpen && (
        <EditProfileModal
          profile={profile}
          setProfile={setProfile}
          onClose={() => setEditProfileOpen(false)}
          onSave={handleSaveProfile}
        />
      )}

      <QuickLinks
        links={["Orders", "Wishlist", "Rewards", "Subscriptions"]}
        onClick={handleAction}
      />

      <Section title="Account">
        <InfoRow label="Email" value={profile.email} />
        <InfoRow label="Phone" value={profile.phone} />
      </Section>

      {/* Addresses */}
      <Section title="Addresses">
        {user.addresses.map((addr) => (
          <ListItem
            key={addr.id}
            title={addr.label}
            subtitle={`${addr.address}, ${addr.city}, ${addr.state}, ${addr.pincode}, ${addr.country}`}
            actionText="Edit"
            onAction={() => setAddressModal({ open: true, editItem: addr })}
          />
        ))}
        <AddButton
          text="+ Add Address"
          onClick={() => setAddressModal({ open: true, editItem: null })}
        />
      </Section>

      {addressModal.open && (
        <AddressModal
          title={addressModal.editItem ? "Edit Address" : "Add Address"}
          data={addressModal.editItem || {}}
          onClose={() => setAddressModal({ open: false, editItem: null })}
          onSave={handleSaveAddress}
        />
      )}

      {/* Payment Methods */}
      <Section title="Payment Methods">
        {user.paymentMethods.map((pm) => (
          <ListItem
            key={pm.id}
            title={pm.type}
            subtitle={
              pm.type === "Card" ? `${pm.cardNumber} (${pm.name})` : pm.upiId
            }
            actionText="Edit"
            onAction={() => setPaymentModal({ open: true, editItem: pm })}
          />
        ))}
        <AddButton
          text="+ Add Payment Method"
          onClick={() => setPaymentModal({ open: true, editItem: null })}
        />
      </Section>

      {paymentModal.open && (
        <PaymentModal
          title={
            paymentModal.editItem ? "Edit Payment Method" : "Add Payment Method"
          }
          data={paymentModal.editItem || {}}
          onClose={() => setPaymentModal({ open: false, editItem: null })}
          onSave={handleSavePayment}
        />
      )}

      {/* Security */}
      <Section title="Security">
        <ActionButton
          text="Change Password"
          onClick={() => handleAction("Change Password")}
        />
        <ActionButton
          text="Setup Biometric Login"
          onClick={() => handleAction("Setup Biometric Login")}
        />
      </Section>

      {/* Preferences */}
      <Section title="Preferences">
        {["push", "email", "sms"].map((type) => (
          <ToggleRow
            key={type}
            label={`${
              type.charAt(0).toUpperCase() + type.slice(1)
            } Notifications`}
            value={notifications[type]}
            onToggle={() => toggleNotification(type)}
          />
        ))}
        <ToggleRow
          label="Dark Theme"
          value={theme === "dark"}
          onToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
      </Section>

      {/* Support */}
      <Section title="Support">
        {["Help & FAQ", "Contact Support", "Feedback / Rate App"].map(
          (item) => (
            <ActionButton
              key={item}
              text={item}
              onClick={() => handleAction(item)}
            />
          )
        )}
      </Section>

      {/* Account Actions */}
      <Section title="Account Actions">
        <ActionButton
          text="Logout"
          onClick={() => handleAction("Logout")}
          color="red"
        />
        <ActionButton
          text="Delete Account"
          onClick={() => handleAction("Delete Account")}
          color="red"
        />
      </Section>
    </div>
  );
};

// --- Reusable Components ---
const ProfileHeader = ({ user, onEdit }) => (
<div className="bg-yellow-400 p-6 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between items-center">
  <div className="flex items-center">
    <div className="relative">
      {user.profilePic ? (
        <img
          src={user.profilePic}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      {/* Edit / camera icon overlay */}
      <label
        htmlFor="profilePicInput"
        className="absolute bottom-0 right-0 bg-yellow-400 p-1 rounded-full cursor-pointer hover:bg-yellow-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 text-white"
        >
          <path d="M12 5c1.1 0 2 .9 2 2h2v2h2v10H6V9h2V7h2c0-1.1.9-2 2-2z" />
        </svg>
      </label>

      {/* Hidden file input */}
      <input
        id="profilePicInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleProfilePicChange(e);
          e.target.value = ""; // allows selecting the same file again
        }}
      />
    </div>

    <div className="ml-4 text-center md:text-left">
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p className="text-gray-700">{user.tier} Tier</p>
    </div>
  </div>

  <button
    onClick={onEdit}
    className="mt-3 md:mt-0 px-4 py-2 bg-white rounded font-bold hover:bg-gray-100 transition"
  >
    Edit Profile
  </button>
</div>

);
ProfileHeader.propTypes = {
  user: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
};

const EditProfileModal = ({ profile, setProfile, onClose, onSave }) => (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
      <h3 className="text-lg font-bold mb-4">Edit Profile</h3>
      {["name", "email", "phone"].map((field) => (
        <input
          key={field}
          type={field === "email" ? "email" : "text"}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={profile[field]}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, [field]: e.target.value }))
          }
          className="w-full border border-gray-300 rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      ))}
      <div className="flex justify-end space-x-4 mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-yellow-400 text-white rounded font-bold hover:bg-yellow-500"
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </div>
  </div>
);
EditProfileModal.propTypes = {
  profile: PropTypes.object.isRequired,
  setProfile: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

const QuickLinks = ({ links, onClick }) => (
  <div className="flex flex-wrap justify-between mt-6 gap-4">
    {links.map((link) => (
      <button
        key={link}
        onClick={() => onClick(link)}
        className="flex-1 md:flex-auto bg-white p-4 rounded shadow text-center hover:bg-gray-50 transition"
      >
        {link}
      </button>
    ))}
  </div>
);
QuickLinks.propTypes = {
  links: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
};

const Section = ({ title, children }) => (
  <div className="mt-6">
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <div className="bg-white p-4 rounded shadow">{children}</div>
  </div>
);
Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const ListItem = ({ title, subtitle, actionText, onAction }) => (
  <div className="bg-white p-4 rounded mb-2 flex justify-between items-center shadow">
    <div>
      <p className="font-bold">{title}</p>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
    <button
      onClick={onAction}
      className="text-blue-500 font-bold hover:underline"
    >
      {actionText}
    </button>
  </div>
);
ListItem.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
};

const AddButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="w-full mt-2 py-2 bg-teal-100 text-teal-700 font-bold rounded hover:bg-teal-200"
  >
    {text}
  </button>
);
AddButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const ActionButton = ({ text, onClick, color = "blue" }) => (
  <button
    onClick={onClick}
    className={`text-${color}-500 mb-2 text-left w-full hover:underline`}
  >
    {text}
  </button>
);
ActionButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  color: PropTypes.string,
};

const InfoRow = ({ label, value }) => (
  <p>
    <span className="font-bold">{label}: </span>
    {value}
  </p>
);
InfoRow.propTypes = { label: PropTypes.string, value: PropTypes.string };

const ToggleRow = ({ label, value, onToggle }) => (
  <div className="flex justify-between items-center my-2">
    <span>{label}</span>
    <input type="checkbox" checked={value} onChange={onToggle} />
  </div>
);
ToggleRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

// --- Address Modal ---
const AddressModal = ({ title, data, onClose, onSave }) => {
  const [form, setForm] = useState({
    label: data.label || "",
    address: data.address || "",
    city: data.city || "",
    state: data.state || "",
    pincode: data.pincode || "",
    country: data.country || "",
    id: data.id || null,
  });

  const handleChange = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSave = () => {
    if (
      !form.label ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode ||
      !form.country
    ) {
      window.location.href = "/error?msg=All address fields are required";
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        {["label", "address", "city", "state", "pincode", "country"].map(
          (field) => (
            <input
              key={field}
              type="text"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          )
        )}
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-yellow-400 text-white rounded font-bold hover:bg-yellow-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Payment Modal ---
const PaymentModal = ({ title, data, onClose, onSave }) => {
  const [form, setForm] = useState({
    type: data.type || "Card",
    cardNumber: data.cardNumber || "",
    name: data.name || "",
    expiry: data.expiry || "",
    cvv: data.cvv || "",
    upiId: data.upiId || "",
    id: data.id || null,
  });

  const handleChange = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSave = () => {
    if (form.type === "Card") {
      if (!form.cardNumber || !form.name || !form.expiry || !form.cvv) {
        window.location.href = "/error?msg=All card fields are required";
        return;
      }
    } else if (form.type === "UPI") {
      if (!form.upiId) {
        window.location.href = "/error?msg=UPI ID is required";
        return;
      }
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <select
          value={form.type}
          onChange={(e) => handleChange("type", e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
        </select>

        {form.type === "Card" ? (
          <>
            <input
              type="text"
              placeholder="Card Number"
              value={form.cardNumber}
              onChange={(e) => handleChange("cardNumber", e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="text"
              placeholder="Name on Card"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="text"
              placeholder="Expiry (MM/YY)"
              value={form.expiry}
              onChange={(e) => handleChange("expiry", e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="text"
              placeholder="CVV"
              value={form.cvv}
              onChange={(e) => handleChange("cvv", e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </>
        ) : (
          <input
            type="text"
            placeholder="UPI ID"
            value={form.upiId}
            onChange={(e) => handleChange("upiId", e.target.value)}
            className="w-full border border-gray-300 rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        )}

        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-yellow-400 text-white rounded font-bold hover:bg-yellow-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
