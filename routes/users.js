var express = require("express");
var router = express.Router();
const auth = require("../controllers/authControllers");
const { requireAuthUser } = require("../middlewares/authMiddleware");

/* GET users listing. */
router.get("/AllUsers", requireAuthUser, auth.getUsers);

/* GET users Admin. */
router.get("/AllAdmin", requireAuthUser, auth.getAdmin);

/* GET users Simple. */
router.get("/AllSimpleUsers", requireAuthUser, auth.getSimpleUser);

/* GET users Active. */
router.get("/AllUsersActive", requireAuthUser, auth.getUserActive);

/* GET users Desactive. */
router.get("/AllUsersDesactive", requireAuthUser, auth.getUserDesactive);

/* GET users archiver. */
router.get("/AllUsersarchive", requireAuthUser, auth.getUserArchive);

/* GET users archiver. */
router.get("/AllUsersConnecter", requireAuthUser, auth.getUserConnecter);

/* GET users archiver. */
router.get("/AllUsersDeConnecter", requireAuthUser, auth.getUserDeConnecter);

/* GET search a Users .*/
router.get("/searchUsers", requireAuthUser, auth.searchUsers);

/*get user by id */
router.get("/User/:id", requireAuthUser, auth.UserByID);

/* Delete user by ID. */
router.delete("/:id", requireAuthUser, auth.deleteUser);

/* upgrade user to admin. */
router.put("/upgrade",requireAuthUser, auth.upgrade);

/*downgrade admin to user. */
router.put("/downgrade",requireAuthUser, auth.downgrade);

/*archiver user par admin. */
router.put("/archiver",requireAuthUser, auth.archiver);

/*Active */
router.put("/active",requireAuthUser, auth.Active);

/*desactive. */
router.put("/desactive",requireAuthUser, auth.Desactive);

module.exports = router;
