const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  price: Number,
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  txnHash: String,
  manufacturerShare: Number,
  middlemanShare: Number,
  middlemanAddress: String,
});

module.exports = mongoose.model("Order", OrderSchema);
