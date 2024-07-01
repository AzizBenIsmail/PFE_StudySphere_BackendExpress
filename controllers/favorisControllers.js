const Favoris = require('../models/favorisSchema');
const Formation = require('../models/formationSchema');
const User = require('../models/userSchema');

exports.addFavori = async (req, res) => {
  try {
    const { formationId } = req.body;
    const utilisateurId = req.session.user._id;

    // Vérifier si la formation et l'utilisateur existent
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    const utilisateur = await User.findById(utilisateurId);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier si la formation est déjà dans les favoris
    const favorisExist = await Favoris.findOne({ formation: formationId, utilisateur: utilisateurId });
    if (favorisExist) {
      return res.status(400).json({ message: 'La formation est déjà dans les favoris' });
    }

    const newFavori = new Favoris({
      formation: formationId,
      utilisateur: utilisateurId,
    });

    const savedFavori = await newFavori.save();

    // Mettre à jour les favoris de l'utilisateur
    await User.updateOne(
      { _id: utilisateurId },
      { $push: { Favoris: savedFavori._id } }
    );

    res.status(201).json(savedFavori);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFavori = async (req, res) => {
  try {
    const { favoriId } = req.params;
    const utilisateurId = req.session.user._id;

    const favori = await Favoris.findOneAndDelete({
      _id: favoriId,
      utilisateur: utilisateurId,
    });

    if (!favori) {
      return res.status(404).json({ message: 'Favori non trouvé' });
    }

    // Mettre à jour les favoris de l'utilisateur
    await User.updateOne(
      { _id: utilisateurId },
      { $pull: { Favoris: favoriId } }
    );

    res.status(200).json({ message: 'Favori supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFavoris = async (req, res) => {
  try {
    const utilisateurId = req.session.user._id;

    const favoris = await Favoris.find({ utilisateur: utilisateurId })
    .populate('formation')
    .exec();

    res.status(200).json(favoris);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
