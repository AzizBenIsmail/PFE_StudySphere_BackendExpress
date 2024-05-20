const Formation = require('../models/formationSchema');
const User = require('../models/userSchema');
const fs = require('fs') // Importer le modèle d'utilisateur

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
    const formation = await Formation.findById(req.params.id).populate("centre").populate("formateur");
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

exports.getFormationByIdFormateur = async (req, res) => {
  try {
    console.log(req.params.id)
    const formations = await Formation.find({ formateur: req.params.id });
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
    // Extraire chaque champ individuellement
    const {
      titre,
      description,
      competences,
      styleEnseignement,
      Prix,
      jours,
      typeContenu,
      langue,
      emplacement,
      sujetInteret,
      Tranches_Horaires,
      duree,
      niveauDengagementRequis,
      niveauDeDifficulte,
      niveauRequis,
      dateDebut,
      dateFin,
      formateur,
      centre,
    } = req.body;
console.log(req.body)
    // Créer un objet avec les champs mis à jour
    const updatedFields = {};

    if (req.file) { // Vérifier si une nouvelle image est fournie
      updatedFields.image_Formation = req.file.filename; // Mettre à jour le nom du fichier de l'image
    }

    // Ajouter les champs mis à jour à l'objet
    if (titre) updatedFields.titre = titre;
    if (description) updatedFields.description = description;
    if (competences) updatedFields.competences = competences;
    if (styleEnseignement) updatedFields.styleEnseignement = styleEnseignement;
    if (Prix) updatedFields.Prix = Prix;
    if (jours) updatedFields.jours = jours;
    if (typeContenu) updatedFields.typeContenu = typeContenu;
    if (langue) updatedFields.langue = langue;
    if (emplacement) updatedFields.emplacement = emplacement;
    if (sujetInteret) updatedFields.sujetInteret = sujetInteret;
    if (Tranches_Horaires) updatedFields.Tranches_Horaires = Tranches_Horaires;
    if (duree) updatedFields.duree = duree;
    if (niveauDengagementRequis) updatedFields.niveauDengagementRequis = niveauDengagementRequis;
    if (niveauDeDifficulte) updatedFields.niveauDeDifficulte = niveauDeDifficulte;
    if (niveauRequis) updatedFields.niveauRequis = niveauRequis;
    if (dateDebut) updatedFields.dateDebut = dateDebut;
    if (dateFin) updatedFields.dateFin = dateFin;
    if (formateur) updatedFields.formateur = formateur;
    if (centre) updatedFields.centre = centre;

    // Mettre à jour la formation avec les champs mis à jour
    const formation = await Formation.findByIdAndUpdate(req.params.id, updatedFields, {
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
    if (formation.image_Formation) {
      const imagePath = `public/images/Formations/${formation.image_Formation}`;
      fs.unlinkSync(imagePath); // Supprimer le fichier
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getFormationsByLocation = async (req, res) => {
  try {
    const emplacements = req.query.emplacements
    console.log(emplacements);
    const formations = await Formation.find({ emplacement: { $in: emplacements } }).populate("centre").populate("formateur");

    res.status(200).json({ formations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getFormationsDomaine = async (req, res) => {
  try {
    const sujetInteret = req.query.sujetInteret
    console.log(sujetInteret);
    const formations = await Formation.find({ sujetInteret: { $in: sujetInteret } }).populate("centre").populate("formateur");

    res.status(200).json({ formations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.getFormationsParLocalisation = async (req, res) => {
  try {
    const userId = req.session.user._id; // Récupérer l'ID de l'utilisateur connecté
    const user = await User.findById(userId).populate('preferences'); // Récupérer l'utilisateur avec ses préférences
    const userLocation = user.preferences.emplacement_actuelle; // Récupérer la localisation actuelle du client depuis ses préférences
    const userDomaine = user.preferences.domaine_actuelle; // Récupérer le domaine d'intérêt du client depuis ses préférences

    // Récupérer les formations basées sur la localisation du client et qui ont le même domaine
    const formations = await Formation.find({ emplacement: userLocation, sujetInteret: userDomaine })
    .populate('centre')
    .populate('formateur');

    res.status(200).json({ formations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
