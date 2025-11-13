// src/pages/admin/AdminSignup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import axios from "axios";
function AdminSignup() {
  const navigate = useNavigate();
    const [form, setForm] = useState({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agree: false,
    });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
   function validate() {
     const e = {};

     if (!form.fullName.trim()) {
       e.fullName = "Full name is required";
     }
     if (!/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(form.email)) {
       e.email = "Invalid email address";
     }

     if (!form.phone.trim()) {
       e.phone = "Phone number is required";
     } else if (!/^[0-9]{10}$/.test(form.phone.trim())) {
       e.phone = "Phone must be a valid 10-digit number";
     }

     if (form.password.length < 8) {
       e.password = "Password must be at least 8 characters";
     }

     if (form.password !== form.confirmPassword) {
       e.confirmPassword = "Passwords do not match";
     }

     if (!form.agree) {
       e.agree = "You must agree to the terms";
     }

     return e;
   }


  // ✅ Submit logic
  // ✅ Submit logic
  async function handleSubmit(e) {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;

    setLoading(true);
    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirmPassword: form.confirmPassword,
        termsAccepted: form.agree,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URI}/admin/signup`,
        payload
      );

      // Success popup
      Swal.fire({
        title: "✅ Admin Registered",
        text:
          res.data?.message ||
          "Verification email sent. Please verify to continue.",
        icon: "success",
        confirmButtonColor: "#0d6efd",
      });

      // You can store token if you want auto-login:
      // localStorage.setItem("adminToken", res.data.token);

      navigate("/admin/login");
    } catch (err) {
      const resp = err.response;

      // If backend sent field-wise errors
      if (resp && resp.data && resp.data.errors) {
        setErrors(resp.data.errors);
      }

      Swal.fire({
        title: "Signup Failed",
        text:
          resp?.data?.message ||
          err.message ||
          "Something went wrong during signup.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  // ✅ Password strength indicator
  const getStrength = (pwd) => {
    if (!pwd) return "";
    const strong = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    if (strong.test(pwd)) return "strong";
    if (pwd.length >= 6) return "medium";
    return "weak";
  };
  const strength = getStrength(form.password);

  return (
    <div
      className="d-flex justify-content-center align-items-center
     min-vh-100 bg-secondary"
    >
      <div
        className="card shadow-lg border-1 border-dark p-2"
        style={{
          width: "530px",
          borderRadius: "16px",
        }}
      >
        <div
          className="card-body  rounded-3
         py-4 px-5"
        >
          <h3
            className="text-center mb-2 fw-bold text-dark text-uppercase
          d-flex justify-content-center align-items-center gap-3 "
          >
            <MdAdminPanelSettings size={30} />
            Admin Sign-Up
            <MdAdminPanelSettings size={30} />
          </h3>
          <p className="text-center text-muted mb-4 small">
            Create your admin account to manage the platform securely.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className={`form-control border-secondary ${
                  errors.fullName ? "is-invalid" : ""
                }`}
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
              {errors.fullName && (
                <div className="invalid-feedback">{errors.fullName}</div>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold border-secondary">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                className={`form-control border-secondary ${
                  errors.email ? "is-invalid" : ""
                }`}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>
            {/* Phone */}
            <div className="mb-3">
              <label className="form-label fw-semibold border-secondary">
                Phone Number
              </label>
              <input
                type="tel"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
            </div>

            {/* Password */}
            <div className="mb-3 ">
              <label className="form-label fw-semibold ">Password</label>
              <div className="input-group border border-secondary rounded">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  className={`form-control  ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  style={{
                    border: "none",
                  }}
                />
                <button
                  type="button"
                  className="btn "
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <div className="invalid-feedback d-block">
                  {errors.password}
                </div>
              )}
              {strength && (
                <small
                  className={`mt-1 d-block ${
                    strength === "strong"
                      ? "text-success"
                      : strength === "medium"
                      ? "text-warning"
                      : "text-danger"
                  }`}
                >
                  Password strength: {strength}
                </small>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Confirm Password</label>
              <div className="input-group border border-secondary rounded">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className={`form-control ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                />
                <button
                  type="button"
                  className="btn "
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="invalid-feedback d-block">
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="form-check mb-4 d-flex justify-content-center align-items-center gap-2">
              <input
                className={`form-check-input ${
                  errors.agree ? "is-invalid" : ""
                }`}
                type="checkbox"
                checked={form.agree}
                onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                id="agreeCheck"
              />
              <label
                className="form-check-label small text-muted"
                htmlFor="agreeCheck"
              >
                I agree to the{" "}
                <a
                  href="/terms"
                  className="text-primary text-decoration-underline"
                >
                  Terms & Conditions
                </a>
                .
              </label>
              {errors.agree && (
                <div className="invalid-feedback">{errors.agree}</div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-4 mb-0">
            Already have an account?{" "}
            <a
              href="/admin/login"
              className="text-decoration-none text-primary"
            >
              Sign In
            </a>
          </p>

          <div className="text-center mt-3 text-muted small">
            🔐 MFA, reCAPTCHA, and approval system ready.
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSignup;
