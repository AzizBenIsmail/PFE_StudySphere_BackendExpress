const express = require("express");
const router = express.Router();
const stats = require("../controllers/statsControllers");
const { requireAuthUser } = require('../middlewares/authMiddleware')


// Routes pour les XP
router.get("/totals", stats.getTotals);


module.exports = router;
