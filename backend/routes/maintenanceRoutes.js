const express = require("express");
const router = express.Router();
const maintenanceController = require("../controllers/maintenanceController");

// public read-only
router.get("/", maintenanceController.getAll);

// admin crud (could be protected using middleware if desired)
router.post("/", maintenanceController.create);
router.put("/:id", maintenanceController.update);
router.delete("/:id", maintenanceController.remove);

module.exports = router;
