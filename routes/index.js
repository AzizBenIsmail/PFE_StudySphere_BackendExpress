var express = require('express');
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

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json("work")
});
router.post("/register",upload.single("image_user"),addUser);

module.exports = router;
