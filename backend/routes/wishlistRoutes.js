const router = require("express").Router();
const ctrl = require("../controllers/wishlistController");

// your auth middleware that populates req.user (cookie/JWT based)
const requireUser = require("../middleware/requireUser"); // adapt to your project

router.get("/", requireUser, ctrl.list);
router.post("/toggle",requireUser, ctrl.toggle);
router.delete("/:productId",requireUser, ctrl.remove);
router.post("/bulk",requireUser, ctrl.bulkAdd);

module.exports = router;
