const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

// JWT_SECRET value from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Protect routes
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          message: "Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.",
        });
      }

      next();
    } catch (error) {
      console.error("Token verification error:", error.message);
      return res
        .status(401)
        .json({ message: "Oturum süresi dolmuş veya token geçersiz" });
    }
  } else {
    return res.status(401).json({ message: "Token eksik, lütfen giriş yapın" });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Yetkisiz erişim" });
  }
};

// Default auth middleware for backward compatibility
const auth = protect;

module.exports = { protect, admin, auth };
