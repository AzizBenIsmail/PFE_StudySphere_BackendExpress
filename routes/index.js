var express = require("express");
const cookieParser = require("cookie-parser");
var router = express.Router();
const upload = require("../middlewares/upload");
const {
  getUsers,
  getUser,
  addUser,
  deleteUser,
  updateUser,
  forgotpwd,
} = require("../controllers/authControllers");

const {requireAuth} = require("../middlewares/authMiddleware");

/* GET home page. */
router.get("/", requireAuth,function (req, res, next) {
  res.json("work");
});

router.get("/set-cookies", (req, res) => {
  // res.setHeader('Set-Cookie', 'hh=true');
  // res.setHeader('Cache-Control', 'no-cache');
  res.cookie("youta", false);
  res.cookie("zizou", true, { maxAge: 3600 });
  res.json("you got the cookies");
});

router.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  res.json(cookies);
});

module.exports = router;
