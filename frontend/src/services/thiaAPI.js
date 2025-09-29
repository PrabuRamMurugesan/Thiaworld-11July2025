import axios from "axios";

const thiaAPI = axios.create({
  baseURL: `${import.meta.env.VITE_API_URI}`, // e.g. https://thiaworld.bbscart.com/api
  withCredentials: true,
});

export default thiaAPI;
