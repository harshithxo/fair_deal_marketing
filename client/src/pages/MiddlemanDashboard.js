import React, { useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

export default function MiddlemanDashboard(){
  const [form, setForm] = useState({ title:"", price:"0.1", manufacturerWallet:"", image:"" });
  const [created, setCreated] = useState(null);

  async function publish(e){
    e.preventDefault();
    try{
      // call backend to create product (backend will generate QR)
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await API.post("/products/create", {
        title: form.title, description: "", image: form.image,
        priceAPT: Number(form.price), mfg_bps: 8000, mm_bps: 2000,
        manufacturerWallet: form.manufacturerWallet, middlemanId: "" // backend expects middlemanId; adapt
      }, { headers });
      setCreated(res.data);
      alert("Product published");
    }catch(err){
      alert(err.response?.data?.error || "Failed");
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="grid grid-2">
          <div className="card">
            <h2>Publish product</h2>
            <p className="small-muted">Add product info and publish on-chain via your wallet.</p>

            <form onSubmit={publish} style={{marginTop:12}} className="grid">
              <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
              <input className="input" placeholder="Image URL" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} />
              <input className="input" placeholder="Manufacturer wallet" value={form.manufacturerWallet} onChange={e=>setForm({...form,manufacturerWallet:e.target.value})} />
              <input className="input" placeholder="Price (APT)" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
              <div>
                <button className="btn btn-primary" type="submit">Publish</button>
              </div>
            </form>
          </div>

          <div className="card">
            <h3>Preview / QR</h3>
            {created ? (
              <div style={{textAlign:"center"}}>
                <img src={created.qrPngDataUrl} alt="qr" width={200} style={{borderRadius:10}}/>
                <div style={{marginTop:8}}><strong>On-chain ID: </strong>{created.onchainProductId}</div>
              </div>
            ) : (
              <div className="small-muted">After publishing you will see the QR here.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
