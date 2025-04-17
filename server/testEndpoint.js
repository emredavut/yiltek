const express = require("express");
const router = express.Router();

// Test endpoint
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Test API is working!" });
});

module.exports = router;
