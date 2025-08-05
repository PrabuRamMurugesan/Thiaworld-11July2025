import { useState } from "react";
import { signupUser } from "../../services/authAPI";
import { useNavigate, Link } from "react-router-dom";

const SignupForm = () => {
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
    <div className="container mt-5">
      <form
        onSubmit={handleSubmit}
        className="p-5 border rounded shadow"
        style={{ width: "500px", margin: "auto" }}
      >
        <h3
          className="mb-4"
          style={{ fontStyle: "italic", fontWeight: "bold", fontSize: "30px" }}
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
        <input
          className="form-control my-2"
          name="password"
          type="password"
          placeholder="Create a password"
          onChange={handleChange}
          required
        />

        <label className="form-label">Phone Number</label>
        <input
          className="form-control my-2"
          name="phone"
          type="tel"
          placeholder="Enter phone number"
          onChange={handleChange}
          required
        />

        <label className="form-label">Select Role</label>
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
        </select>

        <button className="btn btn-success w-100 mt-3">Signup</button>

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
  );
};

export default SignupForm;
