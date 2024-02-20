const userModel = require('../models/userSchema')
const preferencesModel = require('../models/preferencesSchema')

module.exports.AddPreferences = async (req, res) => {
  try {
    const id = req.params.id;

    // Vérifiez si l'utilisateur existe
    const user = await userModel.findById(id);

    if (!user) {
      throw new Error('User not found!');
    }

    // Créez un objet preferences avec les valeurs de la requête
    const preferences = new preferencesModel({
      domaine_actuelle: req.body.domaine_actuelle,
      objectifs_de_carriere: req.body.objectifs_de_carriere,
      Domaine_dinteret: req.body.Domaine_dinteret,
      competences_dinteret: req.body.competences_dinteret,
      niveau_dexperience_professionnelle: req.body.niveau_dexperience_professionnelle,
      interets_personnels: req.body.interets_personnels,
      annee_anniversaire: req.body.annee_anniversaire,
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
      historique_dapprentissage: req.body.historique_dapprentissage,
    });

    // Enregistrez le document Preferences
    await preferences.save();

    // Mettez à jour l'utilisateur avec l'ID des préférences
    const updatedUser = await userModel.findByIdAndUpdate(id, {
      $set: {
        preferences: preferences._id,
      },
    }, { new: true });

    res.status(200).json(updatedUser);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
