import { useState, useContext } from "react";
import { loginUser, sendLoginOTP, verifyLoginOTP } from "../../services/authAPI";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaHome, FaEye, FaEyeSlash, FaPhone } from "react-icons/fa";
import { Spinner } from "react-bootstrap";

const LoginForm = () => {
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

  // ✅ Validation function for email login
  const validateEmailForm = () => {
    const { email, password } = form;

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return "Email is required.";
    if (!emailRegex.test(email)) return "Enter a valid email address.";

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    if (!password.trim()) return "Password is required.";
    if (!passwordRegex.test(password))
      return "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";

    return null; // No errors
  };

  // ✅ Validation function for phone login
  const validatePhoneForm = () => {
    const { phone } = form;
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/[\s\+\-\(\)]/g, "");
    
    if (!phone.trim()) return "Phone number is required.";
    if (!phoneRegex.test(cleanPhone)) return "Enter a valid 10-digit Indian mobile number.";
    return null;
  };

  // Handle send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validatePhoneForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await sendLoginOTP({ phone: form.phone });
      setOtpSent(true);
      setSuccess(res.data.message || "OTP has been sent to your phone.");
      
      // If OTP is included in response (dev mode), show it
      if (res.data.debugOTP) {
        console.log("🔑 OTP for testing:", res.data.debugOTP);
        setSuccess(`OTP sent! (Dev mode: Check console for OTP: ${res.data.debugOTP})`);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to send OTP. Please try again.";
      
      // Extract user-friendly message (remove technical details)
      let userFriendlyMsg = errorMsg;
      if (errorMsg.includes("BSNL SMS API Error") || 
          errorMsg.includes("SMS configuration issue") ||
          errorMsg.includes("Unable to send OTP SMS")) {
        userFriendlyMsg = "Unable to send OTP SMS at the moment. Please try again later or contact support.";
      } else if (errorMsg.includes("Invalid Input")) {
        userFriendlyMsg = "SMS service configuration issue. Please contact support.";
      }
      
      setError(userFriendlyMsg);
      
      // Log technical details and OTP to console for debugging/testing
      if (err.response?.data?.debugOTP) {
        console.log("🔑 OTP Generated (for testing):", err.response.data.debugOTP);
        console.log("⚠️ SMS sending failed, but OTP is available for testing");
        console.log("📋 Technical details:", err.response.data.troubleshooting);
        // Show OTP in a user-friendly way in console
        console.log(`\n${"=".repeat(60)}`);
        console.log(`⚠️ SMS FAILED - OTP FOR TESTING:`);
        console.log(`   Phone: ${phone}`);
        console.log(`   OTP: ${err.response.data.debugOTP}`);
        console.log(`   You can use this OTP to test login manually`);
        console.log(`${"=".repeat(60)}\n`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle verify OTP and login
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.otp || form.otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyLoginOTP({ phone: form.phone, otp: form.otp });
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateEmailForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email: form.email, password: form.password });
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 bg-[rgb(134,178,165)] rounded-xl border-3 border-black w-full max-w-xl mx-auto p-4 px-5">
      <div className="flex justify-center mb-3">
        <Link to="/">
          <FaHome className="text-white text-lg cursor-pointer" />
        </Link>
      </div>

      {/* Login Method Toggle */}
      <div className="flex gap-2 mb-4 w-full justify-center">
        <button
          type="button"
          onClick={() => {
            setLoginMethod("email");
            setOtpSent(false);
            setError("");
            setSuccess("");
            setForm({ ...form, otp: "" });
          }}
          className={`px-4 py-2 rounded text-sm font-semibold ${
            loginMethod === "email"
              ? "bg-white text-orange-500"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Email Login
        </button>
        <button
          type="button"
          onClick={() => {
            setLoginMethod("phone");
            setOtpSent(false);
            setError("");
            setSuccess("");
            setForm({ ...form, email: "", password: "", otp: "" });
          }}
          className={`px-4 py-2 rounded text-sm font-semibold ${
            loginMethod === "phone"
              ? "bg-white text-orange-500"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          Phone OTP Login
        </button>
      </div>

      <form
        onSubmit={loginMethod === "email" ? handleEmailLogin : otpSent ? handleVerifyOTP : handleSendOTP}
        className="flex flex-col items-start"
      >
        <h3 className="text-2xl font-bold text-center w-full mb-3">Login</h3>

        {error && <div className="text-red-600 text-sm mb-2 w-full">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-2 w-full">{success}</div>}

        {loginMethod === "email" ? (
          <>
            <label htmlFor="email" className="text-sm font-semibold mb-1">
              E-mail
            </label>
            <input
              className="w-full mb-2 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password" className="text-sm font-semibold mb-1">
              Password
            </label>
            <div className="relative w-full">
              <input
                className="w-full mb-2 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer text-gray-600 text-sm"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-orange-500 font-semibold py-1.5 my-2 rounded hover:bg-orange-100 text-sm mb-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </>
        ) : (
          <>
            {!otpSent ? (
              <>
                <label htmlFor="phone" className="text-sm font-semibold mb-1 flex items-center gap-2">
                  <FaPhone /> Phone Number
                </label>
                <input
                  className="w-full mb-2 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  name="phone"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={10}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-orange-500 font-semibold py-1.5 my-2 rounded hover:bg-orange-100 text-sm mb-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </>
            ) : (
              <>
                <div className="w-full mb-2 p-2 bg-gray-100 rounded text-sm">
                  OTP sent to: {form.phone}
                </div>
                <label htmlFor="otp" className="text-sm font-semibold mb-1">
                  Enter OTP
                </label>
                <input
                  className="w-full mb-2 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm text-center text-lg tracking-widest"
                  name="otp"
                  type="text"
                  placeholder="000000"
                  value={form.otp}
                  onChange={handleChange}
                  maxLength={6}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-orange-500 font-semibold py-1.5 my-2 rounded hover:bg-orange-100 text-sm mb-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP & Login"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setForm({ ...form, otp: "" });
                    setError("");
                    setSuccess("");
                  }}
                  className="w-full text-gray-600 text-xs underline"
                >
                  Change Phone Number
                </button>
              </>
            )}
          </>
        )}

        <div className="text-center w-full text-xs mt-2">
          Don't have an account?{" "}
          <Link to="/signup" className="font-bold underline">
            Sign Up
          </Link>
        </div>

        <div className="text-center w-full text-xs mt-2">
          <Link to="/forgot-password" className="font-bold underline">
            Forgot Password
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
