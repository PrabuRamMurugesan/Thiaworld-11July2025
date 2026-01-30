import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const LoginPopup = ({ show, onClose }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
  };

  const handleLogin = () => {
    handleClose();
    navigate("/login");
  };

  const handleSignUp = () => {
    handleClose();
    navigate("/signup");
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
          <div className="modal-body text-center">
            <p className="text-muted mb-4">
              Please login or signup to add items to cart and wishlist.
            </p>

            <div className="d-flex flex-column gap-3">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={handleLogin}
              >
                Login
              </button>
              <button
                type="button"
                className="btn btn-outline-primary w-100"
                onClick={handleSignUp}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
