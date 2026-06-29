// server/src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ error: "Access denied. No token provided." });

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains user id, role, walletAddress, etc.
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};
