const express = require("express");
const router = express.Router();
const niveau = require("../controllers/niveauControllers");

router.post("/", niveau.createNiveau);
router.get("/", niveau.getNiveau);
router.get("/:id", niveau.getNiveauById);
router.put("/:id", niveau.updateNiveau);
router.delete("/:id", niveau.deleteNiveau);

module.exports = router;
