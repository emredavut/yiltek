const path = require("path");
const fs = require("fs");

// @desc    Upload file
// @route   POST /api/upload
// @access  Private/Admin
const uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      message: "File uploaded successfully",
      filePath: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private/Admin
const uploadMultipleFiles = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const filePaths = req.files.map((file) => `/uploads/${file.filename}`);

    res.json({
      message: "Files uploaded successfully",
      filePaths,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Görsel yükleme fonksiyonu
const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Lütfen bir dosya seçin" });
    }

    // Dosya URL oluştur
    const fileUrl = `/uploads/${req.file.filename}`;

    // Başarılı yanıt gönder
    res.status(200).json({
      message: "Dosya başarıyla yüklendi",
      imageUrl: fileUrl,
    });
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    res.status(500).json({ message: "Dosya yüklenirken bir hata oluştu" });
  }
};

// Yeni dosya yükleme fonksiyonu
const uploadFileNew = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Lütfen bir dosya seçin" });
    }

    // Dosya URL oluştur
    const fileUrl = `/uploads/${req.file.filename}`;

    // Başarılı yanıt gönder
    res.status(200).json({
      message: "Dosya başarıyla yüklendi",
      filePath: fileUrl,
    });
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    res.status(500).json({ message: "Dosya yüklenirken bir hata oluştu" });
  }
};

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  uploadImage,
  uploadFileNew,
};
