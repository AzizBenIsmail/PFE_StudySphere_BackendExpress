const Formation = require('../models/formationSchema');
const User = require('../models/userSchema'); // Importer le modèle d'utilisateur

exports.createFormation = async (req, res) => {
  try {
    const { filename } = req.file;
    const formationData = { ...req.body, image_Formation: filename };

    const { formateur, centre } = req.body;

    const Userformateur = await User.findById(formateur);
    let Usercentre = null;

    // Si l'ID du centre est fourni, rechercher le centre correspondant dans la base de données
    if (centre) {
      Usercentre = await User.findById(centre);
    } else {
      // Si aucun ID de centre n'est fourni, affecter une valeur par défaut
      Usercentre = await User.findById(req.session.user._id); // Assurez-vous d'avoir un champ dans le modèle d'utilisateur pour indiquer le centre par défaut
    }

    if (!Userformateur || !Usercentre) {
      return res.status(404).json({ success: false, error: 'Formateur or centre not found' });
    }

    formationData.formateur = Userformateur._id;
    formationData.centre = Usercentre._id;

    const formation = await Formation.create(formationData);

    // Mise à jour des formations pour le formateur et le centre
    await User.updateOne({ _id: formateur }, { $push: { Formations: formation._id } });
    await User.updateOne({ _id: Usercentre._id }, { $push: { Formations: formation._id } });

    res.status(201).json({ formation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getFormations = async (req, res) => {
  try {
    const formations = await Formation.find().populate("centre").populate("formateur");
    res.status(200).json({ formations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller pour récupérer une seule formation par son ID
exports.getFormationById = async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    if (!formation) {
      return res.status(404).json({ success: false, error: 'Formation not found' });
    }
    res.status(200).json({ formation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getFormationsByCentre = async (req, res) => {
  try {
    const formations = await Formation.find({ centre: req.session.user._id });
    console.log(formations);
    if (formations.length === 0) {
      return res.status(404).json({ success: false, error: 'No formations found for this centre' });
    }
    res.status(200).json({ formations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getFormationsById = async (req, res) => {
  try {
    console.log(req.params.id)
    const formations = await Formation.find({ centre: req.params.id });
    // console.log(formations);
    if (formations.length === 0) {
      return res.status(404).json({ success: false, error: 'No formations found for this centre' });
    }
    res.status(200).json({ formations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller pour mettre à jour une formation existante
exports.updateFormation = async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.file) { // Vérifier si une nouvelle image est fournie
      updateData.image_Formation = req.file.filename; // Mettre à jour le nom du fichier de l'image
    }
    const formation = await Formation.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!formation) {
      return res.status(404).json({ success: false, error: 'Formation not found' });
    }
    res.status(200).json({ formation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteFormation = async (req, res) => {
  try {
    const formation = await Formation.findByIdAndDelete(req.params.id);
    if (!formation) {
      return res.status(404).json({ success: false, error: 'Formation not found' });
    }

    // Rechercher les utilisateurs formateur et centre de la formation supprimée
    const formateur = await User.findById(formation.formateur);
    const centre = await User.findById(formation.centre);

    // Retirer l'ID de la formation supprimée des listes de formations des utilisateurs
    if (formateur) {
      await User.findOneAndUpdate(
        { _id: formateur._id },
        { $pull: { Formations: formation._id } }
      );
    }
    if (centre) {
      await User.findOneAndUpdate(
        { _id: centre._id },
        { $pull: { Formations: formation._id } }
      );
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

