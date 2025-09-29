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
    <div className="mt-5 bg-[rgb(134,178,165)] rounded-xl border-3 border-black w-full max-w-xl mx-auto p-4 px-5">
  <div className="flex justify-center mb-3">
    <Link to="/">
      <FaHome className="text-white text-lg cursor-pointer" />
    </Link>
  </div>

  <form onSubmit={handleSubmit} className="flex flex-col items-start">
    <h3 className="text-2xl font-bold text-center w-full mb-3">Login</h3>

    {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

    <label htmlFor="email" className="text-sm font-semibold mb-1">
      E-mail
    </label>
    <input
      className="w-full mb-2 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
      name="email"
      type="email"
      placeholder="Email"
      onChange={handleChange}
      required
    />

    <label htmlFor="password" className="text-sm font-semibold mb-1">
      Password
    </label>
    <input
      className="w-full mb-2 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
      name="password"
      type="password"
      placeholder="Password"
      onChange={handleChange}
      required
    />

    <button className="w-full bg-white text-orange-500 font-semibold py-1.5 my-2 rounded hover:bg-orange-100 text-sm mb-2">
      Login
    </button>

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

    </>
  );
};

export default LoginForm;
