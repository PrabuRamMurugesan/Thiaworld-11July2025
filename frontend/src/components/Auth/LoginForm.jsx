// components/Auth/LoginForm.jsx
import { useState, useContext } from "react";
import { loginUser } from "../../services/authAPI";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
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
    <>
      <div className=" mt-5 bg-orange-400 border-[20px] rounded-[20px]  w-[500px] mx-auto">
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
              style={{ fontSize: "20px", color: "white", cursor: "pointer" }}
            />
          </Link>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-5"
          style={{ width: "450px", margin: "auto" }}
        >
          <h3
            className="mb-4"
            style={{
              fontWeight: "bold",
              fontSize: "35px",
              textAlign: "center",
            }}
          >
            Login
          </h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <label
            htmlFor="email"
            className="form-label"
            style={{ fontSize: "20px" }}
          >
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

          <label
            htmlFor="password"
            className="form-label"
            style={{ fontSize: "20px" }}
          >
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

          <button className="w-full bg-white text-orange-500 font-semibold py-2 rounded hover:bg-orange-100">
            Login
          </button>

          <div className="text-center mt-4">
            <span style={{ fontSize: "16px" }}>
              Don't have an account?{" "}
              <Link to="/signup" className="text-decoration-none fw-bold">
                Sign Up
              </Link>
            </span>
          </div>

          <div className="text-center mt-4">
            <span style={{ fontSize: "16px" }}>
              <Link
                to="/forgot-password"
                className="text-decoration-none fw-bold"
              >
                Forgot Password
              </Link>
            </span>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
