// src/pages/admin/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Card,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { RiLoginCircleFill } from "react-icons/ri";
import axios from "axios";
import Swal from "sweetalert2"; // ✅ Import this

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



async function handleLogin(e) {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const payload = {
      email,
      password,
      rememberMe: remember,
    };

    const res = await axios.post(
      `${import.meta.env.VITE_API_URI}/admin/login`,
      payload
    );

    const { token, user } = res.data || {};

    if (remember) {
      localStorage.setItem("adminToken", token);
    } else {
      sessionStorage.setItem("adminToken", token);
    }

    localStorage.setItem(
      "adminUser",
      JSON.stringify({
        id: user?.id,
        email: user?.email,
        name: user?.name,
        roles: user?.roles,
      })
    );

    navigate("/admin/dashboard");
  } catch (err) {
    const resp = err.response;

    if (resp?.data?.requireVerification) {
      // special case: email sent, ask user to verify
      setError("");
      Swal.fire({
        title: "Email verification required",
        text: resp.data.message,
        icon: "info",
        confirmButtonColor: "#0d6efd",
      });
    } else if (resp?.data?.errors) {
      const firstKey = Object.keys(resp.data.errors)[0];
      setError(resp.data.errors[firstKey]);
    } else {
      setError(
        resp?.data?.message ||
          "Login failed. Please check your email and password."
      );
    }
  } finally {
    setLoading(false);
  }
}



  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <Card
        style={{ width: "100%", maxWidth: "420px" }}
        className="shadow-lg border-0 rounded-4 bg-light"
      >
        <Card.Body className="p-4">
          <h3 className="text-center mb-3 text-dark fw-bold d-flex align-items-center gap-2 justify-content-center">
            {" "}
            <RiLoginCircleFill />
            Admin Login
          </h3>
          <p className="text-center text-muted small mb-4">
            Access your admin dashboard securely
          </p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleLogin}>
            {/* Email */}
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <div className="custom-input-group d-flex gap-1">
                <FaUser className="text-muted ms-2" />
                <Form.Control
                  type="email"
                  placeholder="admin@bbscart.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-0 shadow-none flex-grow-1"
                />
              </div>
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>

              <div
                className="d-flex align-items-center rounded"
                style={{
                  border: "1px solid #ced4da",
                  overflow: "hidden",
                }}
              >
                <div className="px-2 text-muted bg-light d-flex align-items-center">
                  <FaLock />
                </div>

                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-0 shadow-none flex-grow-1"
                  style={{ boxShadow: "none" }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-light border-0"
                  style={{
                    background: "transparent",
                    boxShadow: "none",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="text-end mt-1">
                <a
                  href="/admin/forgot-password"
                  className="small text-decoration-none"
                >
                  Forgot Password?
                </a>
              </div>
            </Form.Group>

            {/* Remember Me */}
            <Form.Group className="mb-3" controlId="rememberMe">
              <Form.Check
                type="checkbox"
                label="Remember Me"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
            </Form.Group>

            {/* Login Button */}
            <Button
              variant="primary"
              type="submit"
              className="w-100 fw-bold"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" animation="border" /> : "Login"}
            </Button>

            <div className="text-center mt-3">
              <small className="text-muted">
                Not an admin?{" "}
                <a href="/admin/signup" className="text-primary fw-semibold">
                  Create Account
                </a>
              </small>
            </div>
          </Form>

          <hr />

          <div className="text-center text-muted small">
            <p>🔒 Secure login with AES-256 encryption</p>
            <p>⚙️ 2FA, session timeout, and device tracking ready</p>
          </div>
        </Card.Body>
      </Card>
      <style>
        {`
        .custom-input-group {
  display: flex;
  align-items: center;
  border: 1px solid #ced4da;
  border-radius: 8px;
 
  background-color: #fff;
  transition: border-color 0.2s ease;
}

.custom-input-group:focus-within {
  border-color: #0d6efd; /* Bootstrap primary color */
  box-shadow: 0 0 0 0.15rem rgba(13, 110, 253, 0.25);
}

.custom-input-group svg {
  font-size: 1.1rem;
  margin-right: 8px;
}

.custom-input-group input {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  background: transparent !important;
}

        `}
      </style>
    </div>
  );
}

export default AdminLogin;
