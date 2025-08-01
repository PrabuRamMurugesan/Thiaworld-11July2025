// components/Auth/LoginForm.jsx
import { useState, useContext } from "react";
import { loginUser } from "../../services/authAPI";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container mt-5">
      <form
        onSubmit={handleSubmit}
        className="p-5 border rounded shadow"
        style={{ width: "500px", margin: "auto" }}
      >
        <h3 className="mb-4" style={{ fontStyle: "italic", fontWeight: "bold", fontSize: "35px" }}>
          Login
        </h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <label htmlFor="email" className="form-label" style={{ fontStyle: "italic", fontSize: "20px" }}>
          E-mail
        </label>
        <input
          className="form-control my-2"
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <label htmlFor="password" className="form-label" style={{ fontStyle: "italic", fontSize: "20px" }}>
          Password
        </label>
        <input
          className="form-control my-2"
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button className="btn btn-primary w-100 mt-3">Login</button>

        <div className="text-center mt-4">
          <span style={{ fontSize: "16px" }}>
            Don't have an account?{" "}
            <Link to="/signup" className="text-decoration-none fw-bold">
              Sign Up
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
