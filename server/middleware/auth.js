const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Yetkilendirme başarısız" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Kullanıcıyı bul ve req.user'a ata (authMiddleware ile uyumlu)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Kullanıcı bulunamadı. Lütfen tekrar giriş yapın." });
    }

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({
          message: "Yetkisiz erişim. Sadece admin kullanıcıları erişebilir.",
        });
    }

    console.log("Token verified successfully");
    next();
  } catch (error) {
    console.error("Admin token verification error:", error.message);
    return res.status(401).json({ message: "Geçersiz token" });
  }
};

module.exports = { authenticateAdmin };
