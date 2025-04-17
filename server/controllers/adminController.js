const jwt = require("jsonwebtoken");
const System = require("../models/systemModel");
const User = require("../models/userModel");
require("dotenv").config();

// JWT_SECRET should match across all files
const JWT_SECRET = process.env.JWT_SECRET;

// Admin girişi
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Veritabanındaki kullanıcıları kontrol et
    const user = await User.findOne({
      $or: [{ email: username }, { name: username }],
    });

    if (user && (await user.matchPassword(password))) {
      if (user.role !== "admin") {
        return res.status(403).json({
          message:
            "Yetkisiz erişim. Sadece admin kullanıcıları giriş yapabilir.",
        });
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: "24h",
      });
      return res.json({
        token,
        username: user.name,
        role: user.role,
        email: user.email,
      });
    }

    return res
      .status(401)
      .json({ message: "Geçersiz kullanıcı adı veya şifre" });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Giriş işlemi sırasında bir hata oluştu" });
  }
};

// Tüm sistemleri getir
const getSystems = async (req, res) => {
  try {
    const systems = await System.find({});
    res.json({ systems });
  } catch (error) {
    console.error("Error getting systems:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Tüm sistemleri getir (Public)
const getPublicSystems = async (req, res) => {
  try {
    console.log("Public systems requested");
    const systems = await System.find({});
    res.json({ systems });
  } catch (error) {
    console.error("Error in getPublicSystems:", error);
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Yeni sistem ekle
const createSystem = async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    if (!name || !description || !imageUrl) {
      return res.status(400).json({ message: "Tüm alanlar gereklidir" });
    }

    const newSystem = await System.create({
      name,
      description,
      imageUrl,
    });

    res.status(201).json({ system: newSystem });
  } catch (error) {
    console.error("Error creating system:", error);
    res.status(500).json({ message: "Sistem eklenirken bir hata oluştu" });
  }
};

// Sistemi güncelle
const updateSystem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl } = req.body;

    const system = await System.findById(id);

    if (!system) {
      return res.status(404).json({ message: "Sistem bulunamadı" });
    }

    system.name = name || system.name;
    system.description = description || system.description;
    system.imageUrl = imageUrl || system.imageUrl;

    const updatedSystem = await system.save();
    res.json({ system: updatedSystem });
  } catch (error) {
    console.error("Error updating system:", error);
    res.status(500).json({ message: "Sistem güncellenirken bir hata oluştu" });
  }
};

// Sistem sil
const deleteSystem = async (req, res) => {
  try {
    const { id } = req.params;

    const system = await System.findById(id);

    if (!system) {
      return res.status(404).json({ message: "Sistem bulunamadı" });
    }

    await system.deleteOne();
    res.json({ message: "Sistem başarıyla silindi" });
  } catch (error) {
    console.error("Error deleting system:", error);
    res.status(500).json({ message: "Sistem silinirken bir hata oluştu" });
  }
};

module.exports = {
  login,
  getSystems,
  getPublicSystems,
  createSystem,
  updateSystem,
  deleteSystem,
};
