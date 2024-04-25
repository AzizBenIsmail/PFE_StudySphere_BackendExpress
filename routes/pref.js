var express = require("express");
var router = express.Router();
const upload = require("../middlewares/uploadFils/uploadImagesUsers");
const pref = require("../controllers/preferencesControllers");
const { requireAuthUser } = require("../middlewares/authMiddleware");
const { userValidation } = require("../middlewares/userValidation");
const { centreValidation } = require("../middlewares/centreValidation");

/* GET user by ID. */
router.put("/addPref",requireAuthUser, pref.AddPreferences);

router.put("/addPrefCentre",requireAuthUser, pref.AddPreferencesCentre);

router.put("/addPrefFormateur",requireAuthUser, pref.addPrefFormateur);

router.get("/GetPref/:id",requireAuthUser, pref.getPreferencesById);

router.put("/updatePreferences",requireAuthUser, pref.updatePreferences);

router.put("/UpdatePreferencesCentre",requireAuthUser, pref.UpdatePreferencesCentre);

router.put("/updatePreferencesFormateur",requireAuthUser, pref.updatePreferences);

module.exports = router;
