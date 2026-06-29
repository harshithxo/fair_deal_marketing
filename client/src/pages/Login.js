import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";

export default function Login(){
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading,setLoading] = useState(false);
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    setLoading(true);
    try{
      const res = await login(form);
      const token = res.data.token;
      const user = res.data.user;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role || "customer");
      nav(user.role==="middleman"? "/middleman-dashboard" : "/customer-dashboard");
    }catch(err){
      alert(err.response?.data?.error || "Login failed");
    }finally{ setLoading(false); }
  }

  return (
    <div className="form-wrap">
      <div className="form-card card">
        <h2>Sign in</h2>
        <p className="small-muted">Login as customer or middleman</p>

        <form onSubmit={submit} style={{marginTop:12}} className="grid">
          <input className="input" placeholder="Email" value={form.email}
                 onChange={e=>setForm({...form,email:e.target.value})} />
          <input className="input" placeholder="Password" type="password" value={form.password}
                 onChange={e=>setForm({...form,password:e.target.value})}/>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading?"Signing in...":"Sign in"}
          </button>
        </form>

        <p style={{marginTop:12}}>No account? <Link to="/signup">Create one</Link></p>
      </div>
    </div>
  );
}
