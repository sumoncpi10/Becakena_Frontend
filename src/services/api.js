import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

// 🔐 Request Interceptor (Attach Token)
API.interceptors.request.use(
  (req) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// ⚠️ Response Interceptor (Better Error Handling)
API.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;

    // 🔥 Token expired / unauthorized
    if (status === 401) {
      alert("Session expired, please login again 🔐");

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    // 🔥 Server error
    if (status === 500) {
      console.error("Server Error 🚨");
    }

    return Promise.reject(error);
  }
);

export default API;