    const express = require("express");
const router = express.Router();
const { register, login, getMyProfile,
  updateMyProfile,} = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/signup", register);
router.post("/login", login);
router.get("/me",auth, getMyProfile);
router.put("/me",auth, updateMyProfile);
module.exports = router;
