const Formation = require('../models/formationSchema');
const User = require('../models/userSchema'); // Importer le modèle d'utilisateur

exports.createFormation = async (req, res) => {
  try {
    const { filename } = req.file; // Récupérer le nom du fichier de l'image
    const formationData = { ...req.body, image_Formation: filename }; // Ajouter le nom du fichier au corps de la requête

    // Récupérer les ID du formateur et du centre à partir du corps de la requête
    const { formateur, centre } = req.body;

    // Rechercher le formateur et le centre dans la base de données
    const Userformateur = await User.findById(formateur);
    const Usercentre = await User.findById(centre);

    // Vérifier si le formateur et le centre existent
    if (!Userformateur || !Usercentre) {
      return res.status(404).json({ success: false, error: 'Formateur or centre not found' });
    }

    // Associer le formateur et le centre à la formation
    formationData.formateur = Userformateur._id;
    formationData.centre = Usercentre._id;

    // Créer la formation avec les données fournies
    const formation = await Formation.create(formationData);

    // Ajouter la formation créée aux formateurs et centres respectifs
    Userformateur.Formations.push(formation._id);
    Usercentre.Formations.push(formation._id);
    await Userformateur.save();
    await Usercentre.save();

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

// Controller pour supprimer une formation existante
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
      formateur.Formations = formateur.Formations.filter(id => id.toString() !== formation._id.toString());
      await formateur.save();
    }
    if (centre) {
      centre.Formations = centre.Formations.filter(id => id.toString() !== formation._id.toString());
      await centre.save();
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
