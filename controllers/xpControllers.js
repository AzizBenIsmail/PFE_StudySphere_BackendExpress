const XP = require('../models/xpSchema');

// Créer une nouvelle XP
const User = require('../models/userSchema'); // Importer le modèle User si ce n'est pas déjà fait
const Niveau = require('../models/niveauSchema'); // Importer le modèle Niveau si ce n'est pas déjà fait
const Badge = require('../models/badgeSchema'); // Importer le modèle Badge si ce n'est pas déjà fait

module.exports.createXP = async (req, res) => {
  try {
    const { pointsGagnes, niveauAtteint, badgeIds, userId } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "L'utilisateur avec cet ID n'existe pas" });
    }

    // Vérifier si le niveau atteint existe
    const niveau = await Niveau.findById(niveauAtteint);
    if (!niveau) {
      return res.status(404).json({ message: "Le niveau avec cet ID n'existe pas" });
    }

    // Vérifier si les badges existent et les stocker dans un tableau
    const foundBadges = [];
    if (badgeIds && badgeIds.length > 0) {
      for (const badgeId of badgeIds) {
        const badge = await Badge.findById(badgeId);
        if (!badge) {
          return res.status(404).json({ message: `Le badge avec l'ID ${badgeId} n'existe pas` });
        }
        foundBadges.push(badge._id); // Stocker les identifiants de badges
      }
    }

    // Créer la XP avec les badges associés
    const xp = new XP({ pointsGagnes, niveauAtteint, badgeIds: foundBadges, user: userId });
    const newXP = await xp.save();
    res.status(201).json(newXP);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les XP
module.exports.getAllXP = async (req, res) => {
  try {
    const xpList = await XP.find()
    .populate('user')
    .populate('niveauAtteint')
    .populate('badgeIds'); // Utiliser le chemin 'badges' au lieu de 'badgeId'
    res.status(200).json(xpList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Récupérer un XP par son ID
module.exports.getXPById = async (req, res) => {
  try {
    const xp = await XP.findById(req.params.id);
    if (!xp) {
      return res.status(404).json({ message: "XP introuvable" });
    }
    res.status(200).json(xp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un XP
module.exports.updateXP = async (req, res) => {
  try {
    const { pointsGagnes, niveauAtteint, badgeId, userId } = req.body;
    const xp = await XP.findById(req.params.id);
    if (!xp) {
      return res.status(404).json({ message: "XP introuvable" });
    }
    xp.pointsGagnes = pointsGagnes;
    xp.niveauAtteint = niveauAtteint;
    xp.badgeId = badgeId;
    xp.user = userId;
    const updatedXP = await xp.save();
    res.status(200).json(updatedXP);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un XP
module.exports.deleteXP = async (req, res) => {
  try {
    const xp = await XP.findById(req.params.id);
    if (!xp) {
      return res.status(404).json({ message: "XP introuvable" });
    }
    await XP.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "XP supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
