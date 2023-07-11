var express = require("express");
var router = express.Router();
const upload = require("../middlewares/upload");
const auth = require("../controllers/authControllers");
const { requireAuthUser } = require("../middlewares/authMiddleware");

/* signup. */
router.post("/signup", upload.single("image_user"), auth.signup_post);

/* login. */
router.post("/login", auth.login_post);

/* validation by email. */   
router.get("/validation", auth.activation);

/* logout. */
router.get("/logout", auth.logout);

/* Add User */
router.post("/register",requireAuthUser, upload.single("image_user"), auth.addUser);

/* Update User current */
router.put("/update", requireAuthUser, auth.updateUser);

/* Update User by ID */
router.put("/updateUser/:id", requireAuthUser,upload.single("image_user"), auth.updateUserByID);

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

/* GET search a Users .*/
router.get("/searchUsers", requireAuthUser, auth.searchUsers);

/*get user by id */
router.get("/User/:id", requireAuthUser, auth.UserByID);

/* GET user by ID. */
router.get("/", requireAuthUser, auth.getUser);

/* Delete user by ID. */
router.delete("/:id", requireAuthUser, auth.deleteUser);

/* upgrade user to admin. */
router.put("/upgrade",requireAuthUser, auth.upgrade);

/*downgrade admin to user. */
router.put("/downgrade",requireAuthUser, auth.downgrade);

/*Active */
router.put("/active",requireAuthUser, auth.Active);

/*desactive. */
router.put("/desactive",requireAuthUser, auth.Desactive);

/*forget password. */
router.put("/forgetPassword",auth.forgetPassword);

module.exports = router;
