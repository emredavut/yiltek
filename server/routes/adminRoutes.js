const express = require("express");
const { authenticateAdmin } = require("../middleware/auth");
const {
  login,
  getSystems,
  createSystem,
  updateSystem,
  deleteSystem,
  getPublicSystems,
} = require("../controllers/adminController");

const router = express.Router();

// Public routes
router.post("/login", login);
router.get("/systems/public", getPublicSystems);

// Protected routes
router.get("/systems", authenticateAdmin, getSystems);
router.post("/systems", authenticateAdmin, createSystem);
router.put("/systems/:id", authenticateAdmin, updateSystem);
router.delete("/systems/:id", authenticateAdmin, deleteSystem);

module.exports = router;
