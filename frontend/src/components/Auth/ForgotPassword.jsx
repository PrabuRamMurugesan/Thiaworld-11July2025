import React, { useState } from "react";
import {
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Header from "../Header";
import Footer from "../Footer";

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

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setOtpSent(true);
    setError("");
    setSuccess("OTP has been sent to your email.");
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      setError("OTP must be exactly 6 digits.");
      return;
    }
    if (otp !== "123456") {
      setError("Invalid OTP. Please try again.");
      return;
    }
    setError("");
    setSuccess("");
    setStep(2);
  };

  const handlePasswordReset = (e) => {
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

    setError("");
    setSuccess("Password successfully updated!");

    // Redirect to login page after 2 seconds
    setTimeout(() => {
      navigate("/login");
    }, 2000);
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
                >
                  {otpSent ? "Verify OTP" : "Send OTP"}
                </Button>
              </Form>
            )}

            {step === 2 && (
              <Form onSubmit={handlePasswordReset}>
                <Form.Group className="mb-3" controlId="formNewPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="success" type="submit" className="w-100">
                  Reset Password
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
