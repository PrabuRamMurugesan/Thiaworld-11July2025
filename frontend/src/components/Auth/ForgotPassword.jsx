import React, { useState } from "react";
import {
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
  Card,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Header from "../Header";
import Footer from "../Footer";
import { forgotPassword, verifyOTP, resetPassword } from "../../services/authAPI";

function ForgotPasswordPage() {
  const navigate = useNavigate(); // Initialize navigate
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await forgotPassword({ email });
      setOtpSent(true);
      setSuccess(res.data.message || "OTP has been sent to your email.");
    } catch (err) {
      console.error("Forgot password error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to send OTP. Please try again.";
      setError(errorMessage);
      // Don't set otpSent to true if there's an error
      setOtpSent(false);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await verifyOTP({ email, otp });
      setError("");
      setSuccess(res.data.message || "OTP verified successfully!");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await resetPassword({ email, otp, newPassword });
      setError("");
      setSuccess(res.data.message || "Password successfully updated!");

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container className="mt-5 bg-orange-400 border-[20px] rounded-[10px] w-[450px] h-[450px] mx-auto flex items-center">
        <Row className="w-full">
          <Col>
            <h3 className="mb-4 text-center">Forgot Password</h3>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {step === 1 && (
              <Form onSubmit={otpSent ? handleOtpVerify : handleEmailSubmit}>
                {!otpSent && (
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      size="sm" // 👈 smaller input
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                )}

                {otpSent && (
                  <Form.Group className="mb-3" controlId="formOTP">
                    <Form.Label>Enter 6-digit OTP</Form.Label>
                    <Form.Control
                      size="sm" // 👈 smaller input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      required
                    />
                  </Form.Group>
                )}

                <Button
                  variant="primary"
                  type="submit"
                  className="w-full bg-white text-orange-500 font-semibold py-1.5 rounded hover:bg-orange-100 text-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      {otpSent ? "Verifying..." : "Sending..."}
                    </>
                  ) : (
                    otpSent ? "Verify OTP" : "Send OTP"
                  )}
                </Button>
              </Form>
            )}

            {step === 2 && (
              <Form onSubmit={handlePasswordReset}>
                <Form.Group className="mb-3" controlId="formNewPassword">
                  <Form.Label>New Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        borderLeft: "none",
                        background: "transparent",
                        borderColor: "#ced4da",
                      }}
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        borderLeft: "none",
                        background: "transparent",
                        borderColor: "#ced4da",
                      }}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Button 
                  variant="success" 
                  type="submit" 
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </Form>
            )}
          </Col>
        </Row>
      </Container>
      <Footer/>
    </>
  );
}

export default ForgotPasswordPage;
