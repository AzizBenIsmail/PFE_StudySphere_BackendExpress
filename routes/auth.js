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
router.get("/validation", requireAuthUser, auth.activation);

/* logout. */
router.get("/logout", auth.logout);

/* Add User */
router.post("/register",requireAuthUser, upload.single("image_user"), auth.addUser);

/* Update User by ID */
router.put("/update", requireAuthUser, auth.updateUser);

/* GET users listing. */
router.get("/AllUsers", requireAuthUser, auth.getUsers);

/* GET user by ID. */
router.get("/", requireAuthUser, auth.getUser);

/* Delete user by ID. */
router.delete("/:id", requireAuthUser, auth.deleteUser);

/* upgrade user to admin. */
router.get("/upgrade", auth.upgrade);


module.exports = router;
