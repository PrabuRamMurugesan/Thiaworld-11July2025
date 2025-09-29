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
      <div className="mt-4 bg-[rgb(134,178,165)] rounded-xl border-3 border-black w-full max-w-xl mx-auto p-5 sm:p-4">
        <div className="flex justify-center mb-3">
          <Link to="/" className="text-white">
            <FaHome className="text-xl cursor-pointer" />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <h3 className="text-center italic font-bold text-xl mb-2">
            Create Account
          </h3>

          {error && <div className="alert alert-danger text-sm">{error}</div>}
          {success && (
            <div className="alert alert-success text-sm">{success}</div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="name" className="text-sm font-semibold mb-1">
                Name
              </label>
              <input
                className="form-control px-2 rounded text-sm"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-semibold mb-1">
                E-mail
              </label>
              <input
                className="form-control px-2 rounded text-sm"
                name="email"
                type="email"
                placeholder="Email Address"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label htmlFor="password" className="text-sm font-semibold mb-1">
            Password
          </label>
     
         <div className="grid grid-cols-2 gap-2">
           <div className="relative">
            <input
              className="form-control px-2 rounded w-full text-sm"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer text-gray-600 text-sm"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="relative">
            <input
              className="form-control px-2 rounded w-full text-sm"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer text-gray-600 text-sm"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
         </div>

          <label htmlFor="phone" className="text-sm font-semibold mb-1">
            Phone Number
          </label>
          <input
            className="form-control px-2 rounded text-sm"
            name="phone"
            type="tel"
            placeholder="Phone Number"
            onChange={handleChange}
            required
          />

          <button className="w-full bg-white text-orange-500 font-semibold py-1.5 my-2 rounded hover:bg-orange-100 text-sm">
            Signup
          </button>

          <div className="text-center mt-2 text-xs">
            Already have an account?{" "}
            <Link to="/login" className="font-bold underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignupForm;
