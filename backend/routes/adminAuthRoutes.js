const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  verifyEmail,
} = require("../controllers/adminAuthController");

// POST /api/admin/signup
router.post("/signup", registerAdmin);
router.post("/login", loginAdmin);
router.get("/verify-email", verifyEmail);

module.exports = router;
