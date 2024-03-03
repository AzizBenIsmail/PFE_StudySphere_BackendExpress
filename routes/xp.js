const express = require("express");
const router = express.Router();
const xp = require("../controllers/xpControllers");
const { requireAuthUser } = require('../middlewares/authMiddleware')


// Routes pour les XP
router.post("/",requireAuthUser, xp.createXP);
router.get("/",requireAuthUser, xp.getAllXP);
router.get("/:id",requireAuthUser, xp.getXPById);
router.put("/add50xp/:id", xp.add50xp);
router.put("/delete50xp/:id", xp.delete50xp);
router.put("/:id",requireAuthUser, xp.updateXP);
router.delete("/:id",requireAuthUser, xp.deleteXP);


module.exports = router;
