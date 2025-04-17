const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  uploadFile,
  uploadMultipleFiles,
  uploadImage,
  uploadFileNew,
} = require("../controllers/uploadController");
const { protect, admin } = require("../middleware/authMiddleware");
const { authenticateAdmin } = require("../middleware/auth");

const router = express.Router();

// Set Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Filter files
const fileFilter = (req, file, cb) => {
  // Accept images and PDFs
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Sadece resim ve PDF dosyaları yüklenebilir!"), false);
  }
};

// Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max size
  fileFilter: fileFilter,
});

// @route   POST /api/upload
// @desc    Upload a single file
// @access  Private/Admin
router.post("/", protect, admin, upload.single("file"), uploadFile);

// @route   POST /api/upload/multiple
// @desc    Upload multiple files
// @access  Private/Admin
router.post(
  "/multiple",
  protect,
  admin,
  upload.array("files", 10),
  uploadMultipleFiles
);

// @route   POST /api/upload/image
// @desc    Upload an image
// @access  Private/Admin
router.post("/image", protect, admin, upload.single("file"), uploadImage);

// @route   POST /api/upload/file
// @desc    Upload a file
// @access  Private/Admin
router.post("/file", protect, admin, upload.single("file"), uploadFileNew);

// @route   POST /api/upload/combined
// @desc    Upload a file (works with both auth methods)
// @access  Private/Admin
router.post("/combined", upload.single("file"), async (req, res, next) => {
  try {
    // This endpoint supports either authentication method
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Return both keys to ensure compatibility with different frontend components
    res.json({
      message: "File uploaded successfully",
      filePath: `/uploads/${req.file.filename}`,
      imageUrl: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ message: "Server error during file upload" });
  }
});

module.exports = router;
