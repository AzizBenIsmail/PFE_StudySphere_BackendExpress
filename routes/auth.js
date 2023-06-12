var express = require("express");
var router = express.Router();
const upload = require("../middlewares/upload");
const auth = require("../controllers/authControllers");

/* GET user by ID. */
router.post("/signup",upload.single("image_user"), auth.signup_post);

/* GET user by ID. */
router.post("/login", auth.login_post);

/* GET user by ID. */   
router.get("/validation", auth.activation);

/* GET user by ID. */
router.get("/logout", auth.logout);

/* Add User */
router.post("/register", upload.single("image_user"), auth.addUser);

/* Update User by ID */
router.put("/update/:id", auth.updateUser);

/* GET users listing. */
// router.get("/AllUsers", auth.getUsers);

/* GET user by ID. */
router.get("/:id", auth.getUsers);

/* Delete user by ID. */
router.delete("/:id", auth.deleteUser);



module.exports = router;
