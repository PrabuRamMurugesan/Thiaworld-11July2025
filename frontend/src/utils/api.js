import axios from "axios";

export default axios.create({
  baseURL: "/api/", // ← exactly this
  withCredentials: true,
});
