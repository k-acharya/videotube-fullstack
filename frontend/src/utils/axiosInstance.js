import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://backend-videotube-oaq4.onrender.com/api/v1",
  withCredentials: true, // send cookies automatically
});

export default axiosInstance;
