import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    aptosAddress: "" // Only used if middleman
  });
  const nav = useNavigate();

  // Simple regex for Aptos address validation (0x + 64 hex chars)
  const isValidAptosAddress = (addr) => /^0x[a-f0-9]{64}$/.test(addr);

  async function submit(e) {
    e.preventDefault();

    if (form.role === "middleman" && !isValidAptosAddress(form.aptosAddress.trim().toLowerCase())) {
      alert("❌ Invalid Aptos Wallet Address. Must be 0x + 64 hex chars.");
      return;
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        aptosAddress: form.role === "middleman" ? form.aptosAddress : ""
      };

      const res = await axios.post("http://localhost:5000/api/auth/signup", payload);
      alert(res.data.message || "Signup successful — please login");
      nav("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.error || "Signup failed");
    }
  }

  return (
    <div className="form-wrap">
      <div className="form-card card">
        <h2>Create account</h2>
        <p className="small-muted">Choose customer or middleman</p>

        <form onSubmit={submit} className="grid" style={{ marginTop: 12 }}>
          <input
            className="input"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <select
            className="select"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="customer">Customer</option>
            <option value="middleman">Middleman</option>
          </select>

          {form.role === "middleman" && (
            <input
              className="input"
              placeholder="Aptos Wallet Address"
              value={form.aptosAddress}
              onChange={(e) => setForm({ ...form, aptosAddress: e.target.value })}
              required
            />
          )}

          <button className="btn btn-primary" type="submit">
            Create account
          </button>
        </form>

        <p style={{ marginTop: 12 }}>
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
