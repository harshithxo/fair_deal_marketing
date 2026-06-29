const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  manufacturerAddress: String,
  middlemanAddress: String,
  mfg_bps: Number,
  mm_bps: Number,
  image: String,
  qrCode: String,
});

module.exports = mongoose.model("Product", ProductSchema);
