const express = require("express");
const router = express.Router();
const xp = require("../controllers/xpControllers");


// Routes pour les XP
router.post("/", xp.createXP);
router.get("/", xp.getAllXP);
router.get("/:id", xp.getXPById);
router.put("/:id", xp.updateXP);
router.delete("/:id", xp.deleteXP);


module.exports = router;
