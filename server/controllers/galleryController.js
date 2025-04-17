const Gallery = require("../models/Gallery");
const fs = require("fs");
const path = require("path");

// Get all gallery items
exports.getAllGalleryItems = async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({ createdAt: -1 });
    res.json(galleryItems);
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching gallery items" });
  }
};

// Get a single gallery item by ID
exports.getGalleryItemById = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    res.json(galleryItem);
  } catch (error) {
    console.error("Error fetching gallery item:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching gallery item" });
  }
};

// Create a new gallery item
exports.createGalleryItem = async (req, res) => {
  try {
    console.log("Request files:", req.files);
    console.log("Request body:", req.body);

    // Set default values if not provided
    const title =
      req.body.title ||
      (req.body.type === "image" ? "Image Gallery Item" : "Video Gallery Item");
    const description = req.body.description || "";
    const type = req.body.type;

    if (!type || (type !== "image" && type !== "video")) {
      return res
        .status(400)
        .json({ message: "Valid type (image or video) is required" });
    }

    let url = "";
    let thumbnail = null;

    if (type === "image") {
      // Handle image uploads - either file or URL
      if (req.files && req.files.file && req.files.file.length > 0) {
        // If a file was uploaded
        url = `/uploads/${req.files.file[0].filename}`;
      } else if (req.body.imageUrl) {
        // If an image URL was provided
        url = req.body.imageUrl;
      } else {
        return res
          .status(400)
          .json({ message: "Either an image file or URL is required" });
      }
    } else if (type === "video") {
      // Handle video uploads - either file or URL
      if (req.files && req.files.file && req.files.file.length > 0) {
        // If a video file was uploaded
        url = `/uploads/${req.files.file[0].filename}`;
      } else if (req.body.videoUrl) {
        // If a video URL was provided
        url = req.body.videoUrl;
      } else {
        return res
          .status(400)
          .json({ message: "Either a video file or URL is required" });
      }

      // Handle thumbnail if provided
      if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
        thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
      }
    }

    const galleryItem = new Gallery({
      title,
      description,
      type,
      url,
      thumbnail,
    });

    await galleryItem.save();
    res.status(201).json(galleryItem);
  } catch (error) {
    console.error("Error creating gallery item:", error);
    res
      .status(500)
      .json({ message: "Server error while creating gallery item" });
  }
};

// Update a gallery item
exports.updateGalleryItem = async (req, res) => {
  try {
    console.log("Update request files:", req.files);
    console.log("Update request body:", req.body);

    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    // Update basic fields
    galleryItem.title = req.body.title || galleryItem.title;
    galleryItem.description = req.body.description || galleryItem.description;

    // If changing type, ensure we handle it properly
    if (req.body.type && req.body.type !== galleryItem.type) {
      galleryItem.type = req.body.type;
    }

    // Handle file updates based on type
    if (galleryItem.type === "image") {
      // If a new file was uploaded
      if (req.files && req.files.file && req.files.file.length > 0) {
        // Delete old file if it was stored on server
        if (galleryItem.url.startsWith("/uploads/")) {
          const oldFilePath = path.join(
            __dirname,
            "..",
            "public",
            galleryItem.url
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        // Set new file path
        galleryItem.url = `/uploads/${req.files.file[0].filename}`;
      }
      // If a new URL was provided
      else if (req.body.imageUrl) {
        // Delete old file if it was stored on server
        if (galleryItem.url.startsWith("/uploads/")) {
          const oldFilePath = path.join(
            __dirname,
            "..",
            "public",
            galleryItem.url
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        galleryItem.url = req.body.imageUrl;
      }
    } else if (galleryItem.type === "video") {
      // If a new file was uploaded
      if (req.files && req.files.file && req.files.file.length > 0) {
        // Delete old file if it was stored on server
        if (galleryItem.url.startsWith("/uploads/")) {
          const oldFilePath = path.join(
            __dirname,
            "..",
            "public",
            galleryItem.url
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        // Set new file path
        galleryItem.url = `/uploads/${req.files.file[0].filename}`;
      }
      // If a new URL was provided
      else if (req.body.videoUrl) {
        // Delete old file if it was stored on server
        if (galleryItem.url.startsWith("/uploads/")) {
          const oldFilePath = path.join(
            __dirname,
            "..",
            "public",
            galleryItem.url
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        galleryItem.url = req.body.videoUrl;
      }

      // Handle thumbnail update
      if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
        // Delete old thumbnail if it exists
        if (
          galleryItem.thumbnail &&
          galleryItem.thumbnail.startsWith("/uploads/")
        ) {
          const oldThumbnailPath = path.join(
            __dirname,
            "..",
            "public",
            galleryItem.thumbnail
          );
          if (fs.existsSync(oldThumbnailPath)) {
            fs.unlinkSync(oldThumbnailPath);
          }
        }
        // Set new thumbnail path
        galleryItem.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
      }
    }

    // Update the timestamp
    galleryItem.updatedAt = Date.now();

    await galleryItem.save();
    res.json(galleryItem);
  } catch (error) {
    console.error("Error updating gallery item:", error);
    res
      .status(500)
      .json({ message: "Server error while updating gallery item" });
  }
};

// Delete a gallery item
exports.deleteGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    // Delete local file if it's stored on the server (starts with /uploads/)
    if (galleryItem.url && galleryItem.url.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "..", "public", galleryItem.url);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error("Error deleting file:", err);
        // Continue with database deletion even if file deletion fails
      }
    }

    // For external URLs (http://, https://) or demo images, no file deletion needed
    // If there's a thumbnail stored on the server, delete it
    if (
      galleryItem.thumbnail &&
      galleryItem.thumbnail.startsWith("/uploads/")
    ) {
      const thumbnailPath = path.join(
        __dirname,
        "..",
        "public",
        galleryItem.thumbnail
      );
      try {
        if (fs.existsSync(thumbnailPath)) {
          fs.unlinkSync(thumbnailPath);
        }
      } catch (err) {
        console.error("Error deleting thumbnail:", err);
        // Continue with database deletion even if thumbnail deletion fails
      }
    }

    // Delete the gallery item from the database
    await Gallery.findByIdAndDelete(req.params.id);

    res.json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    res
      .status(500)
      .json({ message: "Server error while deleting gallery item" });
  }
};
