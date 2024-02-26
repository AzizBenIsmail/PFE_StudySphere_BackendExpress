const express = require("express");
const router = express.Router();
const niveau = require("../controllers/niveauControllers");
const { requireAuthUser } = require('../middlewares/authMiddleware')

router.post("/",requireAuthUser, niveau.createNiveau);
router.get("/",requireAuthUser, niveau.getNiveau);
router.get("/:id",requireAuthUser, niveau.getNiveauById);
router.put("/:id",requireAuthUser, niveau.updateNiveau);
router.delete("/:id",requireAuthUser, niveau.deleteNiveau);

module.exports = router;
