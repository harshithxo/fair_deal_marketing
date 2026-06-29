import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// If token present, attach to requests
API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
export const signup = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const fetchProducts = () => API.get("/products");
export const addProduct = (data) => API.post("/products/add", data);
export const buyProduct = (data) => API.post("/orders/buy", data);
