var express = require("express");
var router = express.Router();
const upload = require("../middlewares/upload");
const auth = require("../controllers/authControllers");
const { requireAuthUser } = require("../middlewares/authMiddleware");
const { userValidation } = require("../middlewares/userValidation");
const { centreValidation } = require("../middlewares/centreValidation");

/* GET user by ID. */
router.get("/", requireAuthUser, auth.getUser);

/* verification email pour inscrire . */
router.post("/verification", auth.verification);

/* signup client. */
router.post("/inscrire", userValidation , auth.signupclient);

/* signup centre. */
router.post("/inscrireCentre",upload.single("image_user") , auth.signupcentre);

/* login pour tout les utilisateurs. */
router.post("/login", auth.login_post);

/*Redirection vers l'inscription. */
router.get("/VerificationEmail", auth.VerificationEmail);

/* activation compte par email. */
router.get("/validation", auth.activation);

/*forget password. */
router.put("/forgetPassword",auth.sendforgetPassword);

router.put("/Password",auth.forgetpassword);

/* logout. */
router.get("/logout/:id", auth.logout);
// /* Add User */
// router.post("/register",requireAuthUser, upload.single("image_user"), auth.addUser);

// /* signup. */
// router.post("/signup", upload.single("image_user"), auth.signup_post);




module.exports = router;
