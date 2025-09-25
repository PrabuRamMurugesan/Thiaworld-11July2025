import { useState } from "react";
import { signupUser } from "../../services/authAPI";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user", // dropdown role
    createdFrom: "thiaworld", // auto-tagged
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.role) {
      setError("Please select a user role.");
      return;
    }

    try {
      await signupUser(form); // POST to /api/auth/register (shared)
      setSuccess("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <>
      <div className=" mt-5 bg-orange-400 border-[20px] rounded-[20px]  w-[500px] mx-auto">
        <div className="mt-5">
          <div className="flex justify-center">
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "inherit",
                textAlign: "center",
              }}
            >
              <FaHome
                className="text-center my-3"
                style={{
                  marginRight: "10px",
                  fontSize: "20px",
                  color: "white",
                  cursor: "pointer",
                }}
              />
            </Link>
          </div>
          <form
            onSubmit={handleSubmit}
            className="p-5 "
            style={{ width: "450px", margin: "auto" }}
          >
            <h3
              className="mb-4 text-center"
              style={{
                fontStyle: "italic",
                fontWeight: "bold",
                fontSize: "30px",
              }}
            >
              Create Your Account
            </h3>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <label className="form-label">Full Name</label>
            <input
              className="form-control my-2"
              name="name"
              placeholder="Enter your name"
              onChange={handleChange}
              required
            />

            <label className="form-label">Email Address</label>
            <input
              className="form-control my-2"
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />

            <label className="form-label">Password</label>
            <div className="position-relative my-2">
              <input
                className="form-control"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                onChange={handleChange}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#555",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="position-relative my-2">
              <input
                className="form-control"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                onChange={handleChange}
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#555",
                }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <label className="form-label">Phone Number</label>
            <input
              className="form-control my-2"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              onChange={handleChange}
              required
            />

            {/* <label className="form-label">Select Role</label>
        <select
          className="form-control my-2"
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        >
          <option value="">-- Choose Role --</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="ngo">NGO</option>
          <option value="corporate">Corporate</option>
        </select> */}

            <button className="w-full bg-white text-orange-500 font-semibold py-2 rounded hover:bg-orange-100">
              Signup
            </button>

            <div className="text-center mt-4">
              <span>
                Already have an account?{" "}
                <Link to="/login" className="fw-bold text-decoration-none">
                  Login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupForm;
