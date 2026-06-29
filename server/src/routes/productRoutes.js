// server/src/routes/productRoutes.js
const express = require("express");
const QRCode = require("qrcode");
const Product = require("../models/Product");
const auth = require("../authMiddleware");
const router = express.Router();

function isValidAptosAddress(address) {
  return /^0x[a-f0-9]{64}$/.test(address);
}

router.post("/add", auth, async (req, res) => {
  if (req.user.role !== "middleman") return res.status(403).json({ error: "Only middleman can add products" });

  const { name, description, price, manufacturerAddress, mfg_bps, mm_bps, image } = req.body;
  if (!isValidAptosAddress(manufacturerAddress)) return res.status(400).json({ error: "Invalid manufacturer address" });

  const qrData = `product:${name}|price:${price}|mm:${req.user.walletAddress}`;
  const qrCode = await QRCode.toDataURL(qrData);

  const product = await Product.create({
    name, description, price, manufacturerAddress, middlemanAddress: req.user.walletAddress,
    mfg_bps, mm_bps, image, qrCode
  });

  res.json({ message: "Product added", product });
});

router.get("/", async (req, res) => {
  const products = await Product.find({}, { middlemanAddress: 0 });
  res.json(products);
});

module.exports = router;
