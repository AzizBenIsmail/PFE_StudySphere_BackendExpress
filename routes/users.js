var express = require("express");
var router = express.Router();
const users = require("../controllers/usersControllers");
const upload = require("../middlewares/uploadFils/uploadImagesUsers");
const usersLogMiddleware = require('../middlewares/usersLogMiddleware')
const { requireAuthUser } = require("../middlewares/authMiddleware");

/* GET users listing. */
router.get("/AllUsers",usersLogMiddleware, requireAuthUser, users.getUsers);

/* GET users Admin. */
router.get("/AllAdmin",usersLogMiddleware, requireAuthUser, users.getAdmin);

/* GET users Simple. */
router.get("/AllSimpleUsers",usersLogMiddleware, requireAuthUser, users.getSimpleUser);

/* GET formateur. */
router.get("/AllFormateur",usersLogMiddleware, requireAuthUser, users.getFormateur);

/* GET centre. */
router.get("/AllCentre",usersLogMiddleware, requireAuthUser, users.getCentre);

/* GET moderateur. */
router.get("/AllModerateur",usersLogMiddleware, requireAuthUser, users.getModerateur);

/* GET users Active. */
router.get("/AllUsersActive",usersLogMiddleware, requireAuthUser, users.getUserActive);

/* GET users Desactive. */
router.get("/AllUsersDesactive",usersLogMiddleware, requireAuthUser, users.getUserDesactive);

/* GET users archiver. */
router.get("/AllUsersarchive",usersLogMiddleware, requireAuthUser, users.getUserArchive);

/* GET users archiver. */
router.get("/AllUsersConnecter",usersLogMiddleware, requireAuthUser, users.getUserConnecter);

/* GET users archiver. */
router.get("/AllUsersDeConnecter",usersLogMiddleware, requireAuthUser, users.getUserDeConnecter);

/* GET search a Users .*/
router.get("/searchUsers",usersLogMiddleware, requireAuthUser, users.searchUsers);

/*get user by id */
router.get("/User/:id",usersLogMiddleware, requireAuthUser, users.UserByID);

/*get sidebar users */
router.get("/sidebarUser" ,usersLogMiddleware ,requireAuthUser ,users.getUsersForSidebar );

/* Delete user by ID. */
router.delete("/:id",usersLogMiddleware, requireAuthUser, users.deleteUser);

/* upgrade user to admin. */
router.put("/upgrade",usersLogMiddleware,requireAuthUser, users.upgrade);

/*downgrade admin to user. */
router.put("/downgrade",usersLogMiddleware,requireAuthUser, users.downgrade);

/* upgrade user to admin. */
router.put("/upgradeModerateur",usersLogMiddleware,requireAuthUser, users.upgradeModerateur);

/* upgrade user to admin. */
router.put("/upgradeFormateur",usersLogMiddleware,requireAuthUser, users.upgradeFormateur);

/*archiver user par admin. */
router.put("/archiver",usersLogMiddleware,requireAuthUser, users.archiver);

/*desarchiver user par admin. */
router.put("/desarchiver",usersLogMiddleware,requireAuthUser, users.desarchiver);

/*Active */
router.put("/active",usersLogMiddleware,requireAuthUser, users.Active);

/*desactive. */
router.put("/desactive",usersLogMiddleware,requireAuthUser, users.Desactive);

/* Update User current */
router.put("/update/:id",usersLogMiddleware, requireAuthUser,upload.single("image_user"), users.updateUser);

/* Update User by ID */
router.put("/updatecentre/:id",usersLogMiddleware, requireAuthUser,upload.single("image_user"), users.updateCenterByID);


module.exports = router;
