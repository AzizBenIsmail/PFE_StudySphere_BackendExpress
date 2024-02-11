var express = require("express");
var router = express.Router();
const users = require("../controllers/usersControllers");
const upload = require("../middlewares/upload");

const { requireAuthUser } = require("../middlewares/authMiddleware");

/* GET users listing. */
router.get("/AllUsers", requireAuthUser, users.getUsers);

/* GET users Admin. */
router.get("/AllAdmin", requireAuthUser, users.getAdmin);

/* GET users Simple. */
router.get("/AllSimpleUsers", requireAuthUser, users.getSimpleUser);

/* GET formateur. */
router.get("/AllFormateur", requireAuthUser, users.getFormateur);

/* GET centre. */
router.get("/AllCentre", requireAuthUser, users.getCentre);

/* GET moderateur. */
router.get("/AllModerateur", requireAuthUser, users.getModerateur);

/* GET users Active. */
router.get("/AllUsersActive", requireAuthUser, users.getUserActive);

/* GET users Desactive. */
router.get("/AllUsersDesactive", requireAuthUser, users.getUserDesactive);

/* GET users archiver. */
router.get("/AllUsersarchive", requireAuthUser, users.getUserArchive);

/* GET users archiver. */
router.get("/AllUsersConnecter", requireAuthUser, users.getUserConnecter);

/* GET users archiver. */
router.get("/AllUsersDeConnecter", requireAuthUser, users.getUserDeConnecter);

/* GET search a Users .*/
router.get("/searchUsers", requireAuthUser, users.searchUsers);

/*get user by id */
router.get("/User/:id", requireAuthUser, users.UserByID);

/* Delete user by ID. */
router.delete("/:id", requireAuthUser, users.deleteUser);

/* upgrade user to admin. */
router.put("/upgrade",requireAuthUser, users.upgrade);

/*downgrade admin to user. */
router.put("/downgrade",requireAuthUser, users.downgrade);

/* upgrade user to admin. */
router.put("/upgradeModerateur",requireAuthUser, users.upgradeModerateur);

/* upgrade user to admin. */
router.put("/upgradeFormateur",requireAuthUser, users.upgradeFormateur);

/*archiver user par admin. */
router.put("/archiver",requireAuthUser, users.archiver);

/*Active */
router.put("/active",requireAuthUser, users.Active);

/*desactive. */
router.put("/desactive",requireAuthUser, users.Desactive);

/* Update User current */
router.put("/update/:id", requireAuthUser, users.updateUser);

/* Update User by ID */
router.put("/updatecentre/:id", requireAuthUser,upload.single("image_user"), users.updateCenterByID);


module.exports = router;
