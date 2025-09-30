// src/api/thiaAPI.js
import axios from "axios";

const thiaAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URI, // e.g. http://localhost:5000/api  or https://thiaworld.bbscart.com/api
  withCredentials: true, // send cookies when the server sets them
});

// Attach Bearer from localStorage (works even if cookie isn’t present)
thiaAPI.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    try {
      const raw = localStorage.getItem("bbUser"); // { message, token, user }
      const parsed = raw ? JSON.parse(raw) : null;
      const token = parsed?.token || localStorage.getItem("auth_token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // ignore parse errors
    }
  }
  return config;
});

export default thiaAPI;
