const express = require("express");
const auth = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { buyProduct } = require("../services/aptos");
const router = express.Router();

// Buy product
router.post("/buy/:productId", auth, async (req, res) => {
  try {
    if (req.user.role !== "customer") return res.status(403).json({ error: "Only customers can buy" });

    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const txnHash = await buyProduct(product._id.toString(), product.price, req.user.aptosAddress || "");

    const order = await Order.create({
      product: product._id,
      buyer: req.user._id,
      price: product.price,
      status: "completed",
      txnHash,
      manufacturerShare: Math.floor(product.mfg_bps / 10000 * product.price),
      middlemanShare: Math.floor(product.mm_bps / 10000 * product.price),
      middlemanAddress: product.middlemanAddress
    });

    res.json({ message: "Purchase successful", order, txnHash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get current user orders
router.get("/", auth, async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id }).populate("product");
  res.json(orders);
});

module.exports = router;
