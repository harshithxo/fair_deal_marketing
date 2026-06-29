import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

export default function CustomerDashboard(){
  const [products, setProducts] = useState([]);

  useEffect(()=> {
    API.get("/products").then(r=>setProducts(r.data)).catch(()=>{});
  },[]);

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <h1>Welcome, Customer</h1>
          <p className="small-muted">Scan QR’s or click a product to buy using wallet.</p>

          <div className="products-list" style={{marginTop:18}}>
            {products.map(p=>(
              <div key={p._id} className="product-row">
                <div className="product-thumb">
                  {p.image ? <img src={p.image} alt="" style={{width:"100%",height:"100%",borderRadius:8,objectFit:"cover"}}/> : "IMG"}
                </div>
                <div className="product-info">
                  <div className="product-title">{p.title || p.name}</div>
                  <div className="product-price">₹{(p.price || p.priceInINR || 0)}</div>
                  <div style={{marginTop:8}}><small className="small-muted">By: {p.manufacturerName || p.manufacturer || "manufacturer"}</small></div>
                </div>
                <div style={{width:160}}>
                  <div className="qr-box">
                    {/* If server stored qrDataURL: show it, otherwise build product page link */}
                    {p.qrPngDataUrl ? <img src={p.qrPngDataUrl} alt="qr" width={120}/> : <div style={{fontSize:12,color:"#64748b"}}>Scan to buy</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
