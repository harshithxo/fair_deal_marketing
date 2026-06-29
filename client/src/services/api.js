import axios from "axios";

// Create Axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Attach JWT token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Export API instance for direct use if needed
export default API;

// Auth routes
export const signup = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);

// Product routes
export const fetchProducts = () => API.get("/products");
export const addProduct = (data) => API.post("/products/add", data);

// Order / Buy route
export const buyProduct = (data) => API.post("/orders/buy", data);
