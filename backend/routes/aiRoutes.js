const express = require("express");

const {
    handleAIChat,
} = require("../controllers/aiController.js");
const router = express.Router();

router.post("/chat", handleAIChat);

module.exports = router;
