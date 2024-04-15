var express = require("express");
var router = express.Router();
const upload = require("../middlewares/uploadFils/uploadImagesUsers");
const pref = require("../controllers/preferencesControllers");
const { requireAuthUser } = require("../middlewares/authMiddleware");
const { userValidation } = require("../middlewares/userValidation");
const { centreValidation } = require("../middlewares/centreValidation");

/* GET user by ID. */
router.put("/addPref/:id",requireAuthUser, pref.AddPreferences);

router.put("/addPrefCentre/:id",requireAuthUser, pref.AddPreferencesCentre);

router.get("/GetPref/:id",requireAuthUser, pref.getPreferencesById);

router.put("/updatePreferences/:id",requireAuthUser, pref.updatePreferences);

router.put("/UpdatePreferencesCentre/:id",requireAuthUser, pref.UpdatePreferencesCentre);

router.put("/addPrefFormateur/:id",requireAuthUser, pref.addPrefFormateur);

router.put("/updatePreferencesFormateur/:id",requireAuthUser, pref.updatePreferences);

module.exports = router;
