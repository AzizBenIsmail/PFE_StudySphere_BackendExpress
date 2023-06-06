var express = require("express");
var router = express.Router();
const upload = require("../middlewares/upload");
const {
  getUsers,
  getUser,
  addUser,
  deleteUser,
  updateUser,
  forgotpwd,
} = require("../controllers/userControllers");

/* Add User */
router.post("/register", upload.single("image_user"), addUser);

/* Update User by ID */
router.put("/update/:id", updateUser);

/* GET users listing. */
router.get("/AllUsers", getUsers);

/* GET user by ID. */
router.get("/:id", getUser);

/* Delete user by ID. */
router.delete("/:id", deleteUser);
module.exports = router;
