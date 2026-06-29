import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar(){
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  }

  return (
    <header className="navbar container">
      <div className="brand">FairSplit</div>
      <div className="navlinks">
        <Link to="/products">Products</Link>
        {role === "middleman" ? <Link to="/middleman-dashboard">My Dashboard</Link> : <Link to="/customer-dashboard">My Dashboard</Link>}
        <button onClick={logout} className="btn btn-ghost">Logout</button>
      </div>
    </header>
  );
}
