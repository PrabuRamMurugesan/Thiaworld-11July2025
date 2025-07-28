const express = require("express");
const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.json({ message: "Welcome to Thia API!" });
});

module.exports = router;
