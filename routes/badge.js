var express = require("express");
var router = express.Router();
const badge = require("../controllers/badgeControllers");
const upload = require("../middlewares/uploadFils/uploadBadges");
const { requireAuthUser } = require('../middlewares/authMiddleware')
const badgeLogMiddleware = require('../middlewares/SystemeLogs/badgeLogMiddleware')

// Routes pour les badges
router.post("/",badgeLogMiddleware,requireAuthUser,upload.single("image_badge") , badge.createBadge);
router.get("/",badgeLogMiddleware,requireAuthUser, badge.getAllBadges);
router.get("/:id",badgeLogMiddleware,requireAuthUser, badge.getBadgeById);
router.put("/:id",badgeLogMiddleware,requireAuthUser,upload.single("image_badge"), badge.updateBadge);
router.delete("/:id",badgeLogMiddleware,requireAuthUser, badge.deleteBadge);


module.exports = router;
