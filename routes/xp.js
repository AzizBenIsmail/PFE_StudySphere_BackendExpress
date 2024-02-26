const express = require("express");
const router = express.Router();
const xp = require("../controllers/xpControllers");
const { requireAuthUser } = require('../middlewares/authMiddleware')


// Routes pour les XP
router.post("/", xp.createXP);
router.get("/",requireAuthUser, xp.getAllXP);
router.get("/:id",requireAuthUser, xp.getXPById);
router.put("/:id",requireAuthUser, xp.updateXP);
router.delete("/:id",requireAuthUser, xp.deleteXP);


module.exports = router;
