const userModel = require('../models/userSchema')
const xpModel = require('../models/xpSchema')
const badgeModel = require('../models/badgeSchema')
const preferencesModel = require('../models/preferencesSchema')
const { addNumbrxp } = require('./xpControllers');
const { verificationNiveau } = require('./niveauControllers') // Assurez-vous que le chemin d'importation est correct
const { affecterBadgeUtilisateur } = require('./badgeControllers') // Assurez-vous que le chemin d'importation est correct
const { addNotification } = require('./notificationControllers') // Assurez-vous que le chemin d'importation est correct

module.exports.AddPreferences = async (req, res) => {
  try {
    const id = req.params.id;

    // Vérifiez si l'utilisateur existe
    const user = await userModel.findById(id);

    if (!user) {
      throw new Error('User not found!');
    }
    // Vérifiez s'il existe déjà des préférences pour cet utilisateur
    const existingPreferences = await preferencesModel.findOne({ user: id });

    if (existingPreferences) {
      throw new Error('Preferences already exist for this user');
    }
    // Créez un objet preferences avec les valeurs de la requête
    const preferences = new preferencesModel({
      domaine_actuelle: req.body.domaine_actuelle,
      objectifs_de_carriere: req.body.objectifs_de_carriere,
      Domaine_dinteret: req.body.Domaine_dinteret,
      competences_dinteret: req.body.competences_dinteret,
      niveau_dexperience_professionnelle: req.body.niveau_dexperience_professionnelle,
      interets_personnels: req.body.interets_personnels,
      date_anniversaire: req.body.date_anniversaire,
      niveau_etude: req.body.niveau_etude,
      niveau_dengagement: req.body.niveau_dengagement,
      besoin: req.body.besoin,
      niveau_de_difficulte: req.body.niveau_de_difficulte,
      emplacement_actuelle: req.body.emplacement_actuelle,
      style_dapprentissage: req.body.style_dapprentissage,
      duree_preferee: req.body.duree_preferee,
      budget: req.body.budget,
      disponibilite: req.body.disponibilite,
      type_de_contenu_prefere: req.body.type_de_contenu_prefere,
      preferences_linguistiques: req.body.preferences_linguistiques,
      user: user._id,
    });

    // Enregistrez le document Preferences
    await preferences.save();
    await addNumbrxp(id, 450, req, res);
    await verificationNiveau(id, req, res);

    await addNotification( user._id,"Félicitations ! Vos préférences ont été finalisées de manière satisfaisante.","préférences",`Info/reward/?xpGagne=450`, req, res);

    const updatedUser = await userModel.findByIdAndUpdate(id, {
      $set: {
        preferences: preferences._id,
      },
    }, { new: true });

    await affecterBadgeUtilisateur(id, "Recommendation","recompense","GestionCompte/BadgesNiveauXp", req, res);

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.AddPreferencesCentre = async (req, res) => {
  try {
    const id = req.params.id;

    // Vérifiez si l'utilisateur existe
    const user = await userModel.findById(id);

    if (!user) {
      throw new Error('User not found!');
    }
    // Vérifiez s'il existe déjà des préférences pour cet utilisateur
    const existingPreferences = await preferencesModel.findOne({ user: id });

    if (existingPreferences) {
      throw new Error('Preferences already exist for this user');
    }
    // Créez un objet preferences avec les valeurs de la requête
    const preferences = new preferencesModel({
      domaine_actuelle: req.body.domaine_actuelle,
      competences_dinteret: req.body.competences_dinteret,
      date_anniversaire: req.body.date_anniversaire,
      emplacement_actuelle: req.body.emplacement_actuelle,
      duree_preferee: req.body.duree_preferee,
      disponibilite: req.body.disponibilite,
      preferences_linguistiques: req.body.preferences_linguistiques,
      user: user._id,
    });

    // Enregistrez le document Preferences
    await preferences.save();

    // Mettez à jour l'utilisateur avec l'ID des préférences
    const updatedUser = await userModel.findByIdAndUpdate(id, {
      $set: {
        preferences: preferences._id,
      },
    }, { new: true });


    const xp = await xpModel.findOne({ user: id });
    if (xp) {
      xp.pointsGagnes += 450;
      await xp.save();
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getPreferencesById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    const preferencesId = user.preferences;
    const preferences = await preferencesModel.findById(preferencesId);
    if (!preferences) {
      throw new Error('Préférences non trouvées');
    }
    res.status(200).json(preferences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.UpdatePreferencesCentre = async (req, res) => {
  try {
    const userId = req.params.id;

    // Vérifiez si l'utilisateur existe
    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error('User not found!');
    }

    // Obtenez l'ID des préférences de l'utilisateur
    const preferencesId = user.preferences;

    // Vérifiez si l'utilisateur a des préférences
    if (!preferencesId) {
      throw new Error('User preferences not found!');
    }

    // Mettez à jour les préférences avec les valeurs de la requête
    const updatedPreferences = await preferencesModel.findByIdAndUpdate(preferencesId, {
      domaine_actuelle: req.body.domaine_actuelle,
      competences_dinteret: req.body.competences_dinteret,
      date_anniversaire: req.body.date_anniversaire,
      emplacement_actuelle: req.body.emplacement_actuelle,
      duree_preferee: req.body.duree_preferee,
      disponibilite: req.body.disponibilite,
      preferences_linguistiques: req.body.preferences_linguistiques,
    }, { new: true });

    res.status(200).json(updatedPreferences);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.updatePreferences = async (req, res) => {
  try {
    const userId = req.params.id;

    // Vérifiez si l'utilisateur existe
    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error('User not found!');
    }

    // Recherchez les préférences correspondantes à l'utilisateur
    let preferences = await preferencesModel.findOne({ _id: user.preferences });

    if (!preferences) {
      throw new Error('Preferences not found!');
    }
    console.log(req.body);
    // Mettez à jour les valeurs des préférences avec les données de la requête
    // Mettez à jour les préférences avec les valeurs de la requête
    const updatedPreferences = await preferencesModel.findByIdAndUpdate(preferences._id, {
      domaine_actuelle: req.body.domaine_actuelle,
      objectifs_de_carriere: req.body.objectifs_de_carriere,
      Domaine_dinteret: req.body.Domaine_dinteret,
      competences_dinteret: req.body.competences_dinteret,
      niveau_dexperience_professionnelle: req.body.niveau_dexperience_professionnelle,
      interets_personnels: req.body.interets_personnels,
      date_anniversaire: req.body.date_anniversaire,
      niveau_etude: req.body.niveau_etude,
      niveau_dengagement: req.body.niveau_dengagement,
      besoin: req.body.besoin,
      niveau_de_difficulte: req.body.niveau_de_difficulte,
      emplacement_actuelle: req.body.emplacement_actuelle,
      style_dapprentissage: req.body.style_dapprentissage,
      duree_preferee: req.body.duree_preferee,
      budget: req.body.budget,
      disponibilite: req.body.disponibilite,
      type_de_contenu_prefere: req.body.type_de_contenu_prefere,
      preferences_linguistiques: req.body.preferences_linguistiques,
    }, { new: true });

    res.status(200).json(updatedPreferences);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
