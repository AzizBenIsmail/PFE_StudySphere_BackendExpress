var express = require("express");
var router = express.Router();
const upload = require("../middlewares/upload");
const pref = require("../controllers/preferencesControllers");
const { requireAuthUser } = require("../middlewares/authMiddleware");
const { userValidation } = require("../middlewares/userValidation");
const { centreValidation } = require("../middlewares/centreValidation");

/* GET user by ID. */
router.put("/addPref/:id", pref.AddPreferences);

router.put("/addPrefCentre/:id", pref.AddPreferencesCentre);

router.get("/GetPref/:id", pref.getPreferencesById);


module.exports = router;
