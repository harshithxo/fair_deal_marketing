import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        const p = res.data.find((x) => x._id === id);
        setProduct(p);
      })
      .catch(() => {});
  }, [id]);

  async function handleBuy() {
    if (!product) {
      alert("No product");
      return;
    }

    try {
      setBuying(true);
      const buyerAddress = localStorage.getItem("walletAddress") || "";
      const body = {
        ownerAddress: product.manufacturerAddress,
        productId: product._id,
        price: product.price,
        customerAddress: buyerAddress,
      };
      const res = await API.post("/orders/buy", body);
      alert(
        `Purchase complete. TX: ${res.data.txHash}
Split - Manufacturer: ₹${res.data.split.manufacturer}, Middleman: ₹${res.data.split.middleman}`
      );
    } catch (err) {
      alert(err.response?.data?.error || "Buy failed");
    } finally {
      setBuying(false);
    }
  }

  if (!product)
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="card">Loading product...</div>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card">
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ width: 260 }}>
              {product.qrCode ? (
                <img src={product.qrCode} alt="qr" style={{ width: "100%", borderRadius: 8 }} />
              ) : (
                <div className="product-thumb">IMG</div>
              )}
            </div>
            <div>
              <h2>{product.name}</h2>
              <p className="small-muted">{product.description}</p>
              <div style={{ marginTop: 12 }}>
                <strong>Price: </strong>₹{product.price}
              </div>
              <div style={{ marginTop: 12 }}>
                <button className="btn btn-primary" onClick={handleBuy} disabled={buying}>
                  {buying ? "Processing..." : "Buy now"}
                </button>
              </div>

              <div style={{ marginTop: 8 }}>
                <small className="small-muted">
                  Manufacturer: {product.manufacturerAddress ? "Specified" : "Not specified"}
                </small>
                <br />
                <small className="small-muted">
                  Middleman: {product.middlemanAddress ? "Specified" : "Not specified"}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
