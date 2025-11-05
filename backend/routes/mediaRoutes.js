// routes/mediaRoutes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/mediaController");
// const requireUser = require('../middleware/requireUser');
// const adminOnly = require('../middleware/adminOnly');

router.post("/upload", /* requireUser, adminOnly, */ ctrl.uploadMedia);
router.get("/", /* requireUser, */ ctrl.listMedia);
router.put("/:id", /* requireUser, adminOnly, */ ctrl.updateMedia); // rename/metadata
router.put("/:id/replace", /* requireUser, adminOnly, */ ctrl.replaceMedia); // file replace
router.delete("/:id", /* requireUser, adminOnly, */ ctrl.deleteMedia);

module.exports = router;
