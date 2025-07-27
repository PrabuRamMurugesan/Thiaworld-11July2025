import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AccountSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    newsletter: true,
    marketing: false,
    orderUpdates: true,
    priceDrop: true,
    whatsapp: false,
    twoFA: false,
    personalizedRecommendations: true,
  });

  const [loginActivity] = useState([
    { device: "Chrome on Windows", location: "Mumbai, India", time: "2025-07-02 19:35" },
    { device: "Edge on Mobile", location: "Delhi, India", time: "2025-06-30 11:02" },
  ]);

  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Saved successfully!");
  };

  const handleDownloadData = () => {
    const blob = new Blob([JSON.stringify(form, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "account_data.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const renderPersonalTab = () => (
    <form onSubmit={handleSubmit}>
      <h5 className="mb-3">Personal Information</h5>
      <div className="mb-3">
        <label className="form-label">Full Name</label>
        <input type="text" className="form-control" name="fullName" value={form.fullName} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Phone</label>
        <input type="tel" className="form-control" name="phone" value={form.phone} onChange={handleChange} required />
      </div>
      <button className="btn btn-primary">Save Changes</button>
    </form>
  );

  const renderPasswordTab = () => (
    <form onSubmit={handleSubmit}>
      <h5 className="mb-3">Change Password</h5>
      <div className="mb-3">
        <label className="form-label">Current Password</label>
        <input type="password" className="form-control" name="oldPassword" value={form.oldPassword} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label">New Password</label>
        <input type="password" className="form-control" name="newPassword" value={form.newPassword} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label">Confirm New Password</label>
        <input type="password" className="form-control" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
      </div>
      <button className="btn btn-warning">Update Password</button>
    </form>
  );

  const renderPreferencesTab = () => (
    <form onSubmit={handleSubmit}>
      <h5 className="mb-3">Communication Preferences</h5>
      {["newsletter", "marketing", "orderUpdates", "priceDrop", "whatsapp"].map((key) => (
        <div className="form-check form-switch mb-2" key={key}>
          <input className="form-check-input" type="checkbox" name={key} checked={form[key]} onChange={handleChange} />
          <label className="form-check-label text-capitalize">
            {key.replace(/([A-Z])/g, " $1")}
          </label>
        </div>
      ))}
      <button className="btn btn-success mt-3">Update Preferences</button>
    </form>
  );

  const renderAdvancedTab = () => (
    <div>
      <h5 className="mb-3">Advanced Settings</h5>

      <div className="form-check form-switch mb-3">
        <input className="form-check-input" type="checkbox" name="twoFA" checked={form.twoFA} onChange={handleChange} />
        <label className="form-check-label">Enable Two-Factor Authentication (2FA)</label>
      </div>

      <div className="form-check form-switch mb-3">
        <input className="form-check-input" type="checkbox" name="personalizedRecommendations" checked={form.personalizedRecommendations} onChange={handleChange} />
        <label className="form-check-label">Enable Personalized Product Recommendations</label>
      </div>

      <div className="mb-4">
        <button className="btn btn-outline-primary me-2" type="button" onClick={handleDownloadData}>
          Download My Account Data
        </button>
        <button className="btn btn-outline-danger" type="button" onClick={() => setShowDeactivateModal(true)}>
          Deactivate My Account
        </button>
      </div>

      <h6 className="mb-2">Login Activity</h6>
      <ul className="list-group">
        {loginActivity.map((entry, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between">
            <span>{entry.device}</span>
            <small className="text-muted">{entry.location} — {entry.time}</small>
          </li>
        ))}
      </ul>

      {showDeactivateModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">Confirm Account Deactivation</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeactivateModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to deactivate your account? You can reactivate it later by contacting support.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeactivateModal(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => {
                  setShowDeactivateModal(false);
                  alert("Deactivation request submitted.");
                }}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Header />
      <div className="container my-5">
        <h1 className="text-center mb-4">Account Settings</h1>

        <ul className="nav nav-tabs mb-4 justify-content-center">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "personal" ? "active" : ""}`} onClick={() => setActiveTab("personal")}>Personal Info</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "security" ? "active" : ""}`} onClick={() => setActiveTab("security")}>Password & Security</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "preferences" ? "active" : ""}`} onClick={() => setActiveTab("preferences")}>Preferences</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "advanced" ? "active" : ""}`} onClick={() => setActiveTab("advanced")}>Advanced</button>
          </li>
        </ul>

        <div className="card p-4 shadow-sm">
          {activeTab === "personal" && renderPersonalTab()}
          {activeTab === "security" && renderPasswordTab()}
          {activeTab === "preferences" && renderPreferencesTab()}
          {activeTab === "advanced" && renderAdvancedTab()}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AccountSettingsPage;
