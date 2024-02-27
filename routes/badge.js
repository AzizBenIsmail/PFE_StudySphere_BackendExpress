var express = require("express");
var router = express.Router();
const badge = require("../controllers/badgeControllers");
const upload = require("../middlewares/uploadFils/uploadBadges");
const { requireAuthUser } = require('../middlewares/authMiddleware')

// Routes pour les badges
router.post("/",requireAuthUser,upload.single("image_badge") , badge.createBadge);
router.get("/",requireAuthUser, badge.getAllBadges);
router.get("/:id",requireAuthUser, badge.getBadgeById);
router.put("/:id",requireAuthUser,upload.single("image_badge"), badge.updateBadge);
router.delete("/:id",requireAuthUser, badge.deleteBadge);


module.exports = router;
