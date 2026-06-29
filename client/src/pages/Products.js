import React, { useEffect, useState } from "react";
import { fetchProducts, buyProduct } from "../services/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { QRCodeCanvas } from "qrcode.react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [buyerAddress, setBuyerAddress] = useState(""); // wallet input
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  }

  // Validate Aptos address format: 0x + 64 hex chars
  const isValidAptosAddress = (addr) => /^0x[a-f0-9]{64}$/.test(addr);

  const handleBuyClick = async (product) => {
    const buyer = buyerAddress.trim().toLowerCase();
    if (!isValidAptosAddress(buyer)) {
      setMessage("❌ Invalid Buyer Address. Must be 0x + 64 hex chars.");
      return;
    }

    try {
      const res = await buyProduct({
        ownerAddress: product.manufacturerAddress, // backend split handles middleman
        productId: product._id,
        price: product.price,
        customerAddress: buyer,
      });

      setMessage(
        `✅ Purchase successful! TX: ${res.data.txHash}. 
Split - Manufacturer: ₹${res.data.split.manufacturer}, Middleman: ₹${res.data.split.middleman}`
      );
    } catch (err) {
      console.error(err);
      setMessage(`❌ Purchase failed: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: 20 }}>
        <h1>Products</h1>

        <div style={{ marginBottom: 16 }}>
          <label>Your Aptos Wallet Address:</label>
          <input
            type="text"
            value={buyerAddress}
            onChange={(e) => setBuyerAddress(e.target.value)}
            placeholder="0x..."
            style={{ width: 400, padding: 8, marginTop: 4 }}
          />
        </div>

        <div className="products-list">
          {products.map((p) => (
            <div
              key={p._id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
                border: "1px solid #ccc",
                padding: 10,
                borderRadius: 8,
              }}
            >
              <div style={{ width: 100, height: 100, marginRight: 16 }}>
                {p.image ? (
                  <img
                    src={p.image}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                  />
                ) : (
                  "IMG"
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold" }}>
                  <Link to={`/product/${p._id}`}>{p.name || p.title}</Link>
                </div>
                <div>Price: ₹{p.price}</div>

                {/* Hide addresses but indicate if they exist */}
                <div style={{ marginTop: 4 }}>
                  <small className="small-muted">
                    Manufacturer: {p.manufacturerAddress ? "Specified" : "Not specified"}
                  </small>
                </div>
                <div>
                  <small className="small-muted">
                    Middleman: {p.middlemanAddress ? "Specified" : "Not specified"}
                  </small>
                </div>
              </div>

              <div style={{ width: 150, marginRight: 16 }}>
                <QRCodeCanvas value={`${window.location.origin}/product/${p._id}`} size={120} />
              </div>

              <div>
                <button
                  onClick={() => handleBuyClick(p)}
                  style={{
                    background: "#4CAF50",
                    color: "white",
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>

        {message && <div style={{ marginTop: 20, fontWeight: "bold" }}>{message}</div>}
      </div>
    </>
  );
}
