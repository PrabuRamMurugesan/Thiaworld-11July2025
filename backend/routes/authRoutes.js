const express = require("express");
const router = express.Router();
const { register, login, getMyProfile, deactivateAccount,
  updateMyProfile, forgotPassword, verifyOTP, resetPassword,
  sendLoginOTP, verifyLoginOTP} = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/signup", register);
router.post("/login", login);
router.get("/me",auth, getMyProfile);
router.put("/me",auth, updateMyProfile);
router.put("/deactivate", auth, deactivateAccount);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.post("/send-login-otp", sendLoginOTP);
router.post("/verify-login-otp", verifyLoginOTP);

module.exports = router;
