const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const systemRoutes = require("./systemRoutes");
const uploadRoutes = require("./uploadRoutes");
const galleryRoutes = require("./galleryRoutes");

// Mount routes
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/systems", systemRoutes);
router.use("/upload", uploadRoutes);
router.use("/gallery", galleryRoutes);

module.exports = router;
