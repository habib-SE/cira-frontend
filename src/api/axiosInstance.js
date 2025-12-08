import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ShowErrorToast } from "../components/toast/toast";

// ✅ Create axios instance
const axiosInstance = axios.create({
  // baseURL: "http://localhost:5555",
  baseURL: "https://askainurse.com/api/",
  headers: {
    Accept: "application/json, text/plain, */*",
  },
});

export default axiosInstance