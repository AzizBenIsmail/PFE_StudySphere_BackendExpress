var express = require("express");
var router = express.Router();
const upload = require("../middlewares/upload");
const auth = require("../controllers/authControllers");
const { requireAuthUser } = require("../middlewares/authMiddleware");
const { utilisateurValidation } = require("../middlewares/utilisateurValidation");
const { centreValidation } = require("../middlewares/centreValidation");
const { Validationmotdepasse } = require("../middlewares/Validationmotdepasse");

/* GET user by ID. */
router.get("/", requireAuthUser, auth.getUser);

/* verification email pour inscrire . */
router.post("/verification", auth.verification);

/* signup client. */
router.post("/inscrire", utilisateurValidation , auth.signupclient);

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

/* Update User current */
// router.put("/update", requireAuthUser, auth.updateUser);
//
// /* Update User by ID */
// router.put("/updateUser/:id", requireAuthUser,upload.single("image_user"), auth.updateUserByID);
//
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
