const express = require("express");
const auth = require("../authMiddleware");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { buyProduct } = require("../services/aptos"); // blockchain function
const router = express.Router();

// Customer places order
router.post("/buy/:productId", auth, async (req,res) => {
    try {
        if(req.user.role !== "customer") 
            return res.status(403).json({ error: "Only customers can buy products" });

        const product = await Product.findById(req.params.productId);
        if(!product) return res.status(404).json({ error: "Product not found" });

        // Call Aptos blockchain buy
        const txnHash = await buyProduct(
            product._id.toString(), 
            product.price, 
            req.user.aptosAddress || "" // buyer Aptos address (optional)
        );

        const order = new Order({
            product: product._id,
            buyer: req.user._id,
            price: product.price,
            status: "completed",
            txnHash
        });

        await order.save();
        res.json({ message: "Purchase successful", order });

    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Failed to buy product" });
    }
});

// Get orders for current user
router.get("/", auth, async (req,res) => {
    const orders = await Order.find({ buyer: req.user._id }).populate("product");
    res.json(orders);
});

module.exports = router;
