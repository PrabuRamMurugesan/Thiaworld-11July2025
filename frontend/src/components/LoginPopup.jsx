import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { sendLoginOTP, verifyLoginOTP, loginUser } from "../services/authAPI";
import { FaTimes, FaEye, FaEyeSlash, FaPhone } from "react-icons/fa";
import { Spinner } from "react-bootstrap";

const LoginPopup = ({ show, onClose, onSuccess }) => {
  const [loginMethod, setLoginMethod] = useState("email"); // "email" or "phone"
  const [form, setForm] = useState({ email: "", password: "", phone: "", otp: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // Validation function for email login
  const validateEmailForm = () => {
    const { email, password } = form;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return "Email is required.";
    if (!emailRegex.test(email)) return "Enter a valid email address.";
    if (!password.trim()) return "Password is required.";
    return null;
  };

  // Validation function for phone login
  const validatePhoneForm = () => {
    const { phone } = form;
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/[\s\+\-\(\)]/g, "");
    
    if (!phone.trim()) return "Phone number is required.";
    if (!phoneRegex.test(cleanPhone)) return "Enter a valid 10-digit phone number.";
    return null;
  };

  // Send OTP
  const handleSendOTP = async () => {
    const validationError = validatePhoneForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const cleanPhone = form.phone.replace(/[\s\+\-\(\)]/g, "");
      const response = await sendLoginOTP(cleanPhone);
      
      if (response.success) {
        setOtpSent(true);
        setSuccess("OTP sent successfully!");
      } else {
        setError(response.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!form.otp.trim()) {
      setError("Please enter OTP");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const cleanPhone = form.phone.replace(/[\s\+\-\(\)]/g, "");
      const response = await verifyLoginOTP(cleanPhone, form.otp);
      
      if (response.success) {
        login(response.user);
        setSuccess("Login successful!");
        setTimeout(() => {
          onSuccess?.();
          handleClose();
        }, 500);
      } else {
        setError(response.message || "Invalid OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Email/Password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const validationError = validateEmailForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await loginUser(form.email, form.password);
      
      if (response.success) {
        login(response.user);
        setSuccess("Login successful!");
        setTimeout(() => {
          onSuccess?.();
          handleClose();
        }, 500);
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ email: "", password: "", phone: "", otp: "" });
    setError("");
    setSuccess("");
    setOtpSent(false);
    setShowPassword(false);
    onClose();
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1050,
      }}
      onClick={handleClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Login Required</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>
          <div className="modal-body">
            <p className="text-muted mb-3">
              Please login or signup to add items to cart and wishlist.
            </p>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-3">
              <li className="nav-item">
                <button
                  className={`nav-link ${loginMethod === "email" ? "active" : ""}`}
                  onClick={() => {
                    setLoginMethod("email");
                    setError("");
                    setSuccess("");
                  }}
                >
                  Email
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${loginMethod === "phone" ? "active" : ""}`}
                  onClick={() => {
                    setLoginMethod("phone");
                    setError("");
                    setSuccess("");
                  }}
                >
                  Phone
                </button>
              </li>
            </ul>

            {/* Error/Success Messages */}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}

            {/* Email Login Form */}
            {loginMethod === "email" && (
              <form onSubmit={handleEmailLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : "Login"}
                </button>
              </form>
            )}

            {/* Phone Login Form */}
            {loginMethod === "phone" && (
              <div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaPhone />
                    </span>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="10-digit phone number"
                      disabled={otpSent}
                      required
                    />
                  </div>
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={handleSendOTP}
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : "Send OTP"}
                  </button>
                ) : (
                  <>
                    <div className="mb-3">
                      <label htmlFor="otp" className="form-label">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="otp"
                        name="otp"
                        value={form.otp}
                        onChange={handleChange}
                        placeholder="6-digit OTP"
                        maxLength="6"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={handleVerifyOTP}
                      disabled={loading}
                    >
                      {loading ? <Spinner size="sm" /> : "Verify OTP"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-link w-100 mt-2"
                      onClick={() => {
                        setOtpSent(false);
                        setForm({ ...form, otp: "" });
                      }}
                    >
                      Resend OTP
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="mt-3 text-center">
              <p className="mb-0">
                Don't have an account?{" "}
                <button
                  className="btn btn-link p-0"
                  onClick={() => {
                    handleClose();
                    navigate("/signup");
                  }}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
