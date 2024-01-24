const yup = require("yup");
const UserModel = require("../models/userSchema");

const Validationmotdepasse = async (req, res, next) => {
  try {
    const schema = yup.object().shape({
      password: yup
      .string()
      .required("Le Mot de passe est obligatoire")
      .min(8, "Le Mot de passe doit contenir au moins 8 caractères")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.{8,})/,
        "Le Mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un symbole Exemple mdp : Exemple123 "
      ),
  });

    await schema.validate(req.body);
    next();
  } catch (error) {
    res.json({ message: error.message });
  }
};
module.exports = { Validationmotdepasse };
