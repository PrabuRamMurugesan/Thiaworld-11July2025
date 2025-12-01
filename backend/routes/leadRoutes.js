const express = require("express");
const {saveLead} = require("../controllers/leadController.js");



const router = express.Router();

router.post("/save", saveLead);


module.exports = router;