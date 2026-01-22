import axios from "axios";

console.log("BASE URL:", import.meta.env.VITE_API_URI);  // :check: This will now log the value

const API = axios.create({

baseURL: `${import.meta.env.VITE_API_URI}/auth`,

});

export const loginUser = (data) => API.post("/login", data);

export const signupUser = (data) => API.post("/signup", data);

export const forgotPassword = (data) => API.post("/forgot-password", data);

export const verifyOTP = (data) => API.post("/verify-otp", data);

export const resetPassword = (data) => API.post("/reset-password", data);