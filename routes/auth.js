var express = require("express");
var router = express.Router();
const upload = require("../middlewares/uploadFils/uploadImagesUsers");
const auth = require("../controllers/authControllers");
const { requireAuthUser } = require("../middlewares/authMiddleware");
const { userValidation } = require("../middlewares/userValidation");
const authLogMiddleware = require('../middlewares/SystemeLogs/authLogMiddleware')

/* GET user by ID. */
router.get("/",authLogMiddleware, requireAuthUser, auth.getUser);

/* verification email pour inscrire . */
router.post("/verification",authLogMiddleware, auth.verification);

/* signup client. */
router.post("/inscrire",authLogMiddleware, userValidation , auth.signupclient);

/* signup centre. */
router.post("/inscrireCentre",authLogMiddleware,upload.single("image_user") , auth.signupcentre);

/* login pour tout les utilisateurs. */
router.post("/login",authLogMiddleware, auth.login_post);

/*Redirection vers l'inscription. */
router.get("/VerificationEmail",authLogMiddleware, auth.VerificationEmail);

/* activation compte par email. */
router.get("/validation",authLogMiddleware, auth.activation);

/*forget password. */
router.put("/forgetPassword",authLogMiddleware,auth.sendforgetPassword);

router.put("/Password",authLogMiddleware,auth.forgetpassword);

/* logout. */
router.get("/logout/:id",authLogMiddleware, auth.logout);





module.exports = router;
