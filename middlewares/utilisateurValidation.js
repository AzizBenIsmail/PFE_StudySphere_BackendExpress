const yup = require("yup");
const UserModel = require("../models/userSchema");

const utilisateurValidation = async (req, res, next) => {
  try {
    console.log("test", req.body);
    const schema = yup.object().shape({
      email: yup
      .string()
      .required()
      .email("Format de l'email non valide")
      .test("email_unique", "Cet email est déjà utilisé", async function (value) {
        const isUnique = await checkEmailUniqueness(value);
        return isUnique;
      }),
      nom: yup
      .string()
      .required()
      .min(3, "nom doit entre 3 characters max 15 characters")
      .max(15, "nom doit entre 3 characters max 15 characters"),
      prenom: yup
      .string()
      .required()
      .min(3, "prenom doit entre 3 characters max 15 characters")
      .max(15, "prenom doit entre 3 characters max 15 characters"),
    });
    async function checkEmailUniqueness(email) {
      const existingUser = await UserModel.findOne({ where: { email: email } });
      return !existingUser; // Retourne true si l'email est unique, false sinon
    }
    await schema.validate(req.body);
    next();
  } catch (error) {
    res.json({ message: error.message });
  }
};
module.exports = { utilisateurValidation };
