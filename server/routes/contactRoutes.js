const express = require("express");
const router = express.Router();
const {
  submitContact,
  getContacts,
  getContactById,
  updateContactReadStatus,
  deleteContact,
} = require("../controllers/contactController");
const { protect, admin } = require("../middleware/authMiddleware");

// @route   POST /api/contact
router.post("/", submitContact);

// @route   GET /api/contact
router.get("/", protect, admin, getContacts);

// @route   GET /api/contact/:id
router.get("/:id", protect, admin, getContactById);

// @route   PUT /api/contact/:id
router.put("/:id", protect, admin, updateContactReadStatus);

// @route   DELETE /api/contact/:id
router.delete("/:id", protect, admin, deleteContact);

module.exports = router;
