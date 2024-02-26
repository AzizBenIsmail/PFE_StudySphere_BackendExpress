var express = require("express");
var router = express.Router();
const badge = require("../controllers/badgeControllers");
const upload = require("../middlewares/upload");

// Routes pour les badges
router.post("/",upload.single("image_badge") , badge.createBadge);
router.get("/", badge.getAllBadges);
router.get("/:id", badge.getBadgeById);
router.put("/:id",upload.single("image_badge"), badge.updateBadge);
router.delete("/:id", badge.deleteBadge);


module.exports = router;
