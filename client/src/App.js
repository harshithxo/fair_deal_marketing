import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CustomerDashboard from "./pages/CustomerDashboard";
import MiddlemanDashboard from "./pages/MiddlemanDashboard";
import Products from "./pages/Products";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/customer-dashboard" element={<CustomerDashboard />} />
      <Route path="/middleman-dashboard" element={<MiddlemanDashboard />} />
      <Route path="*" element={<div style={{ padding: 40 }}>Page not found</div>} />
    </Routes>
  );
}

export default App;
