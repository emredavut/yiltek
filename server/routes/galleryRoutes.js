const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/authMiddleware");
const galleryController = require("../controllers/galleryController");
const upload = require("../middleware/uploadMiddleware");

// Get all gallery items
router.get("/", galleryController.getAllGalleryItems);

// Create a new gallery item
router.post(
  "/",
  auth,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  galleryController.createGalleryItem
);

// Update a gallery item
router.put(
  "/:id",
  auth,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  galleryController.updateGalleryItem
);

// Delete a gallery item
router.delete("/:id", auth, galleryController.deleteGalleryItem);

// Get a single gallery item
router.get("/:id", galleryController.getGalleryItemById);

module.exports = router;
