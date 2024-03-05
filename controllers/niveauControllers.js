const Niveau = require('../models/niveauSchema');
const User = require('../models/userSchema')
const XP = require('../models/xpSchema')

module.exports.createNiveau = async (req, res) => {
  const { nom, xpRequis , description } = req.body;
  try {
    const niveau = new Niveau({
      nom: nom,
      description : description,
      xpRequis: xpRequis
    });
    const newNiveau = await niveau.save();
    res.status(200).json(newNiveau);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports.getNiveauById = async (req, res) => {
  const niveauId = req.params.id;
  try {
    const niveau = await Niveau.findById(niveauId);
    res.status(200).json(niveau);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports.getNiveau = async (req, res) => {
  try {
    const niveau = await Niveau.find();
    res.status(200).json(niveau);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports.updateNiveau = async (req, res) => {
  const niveauId = req.params.id;
  const { nom, xpRequis ,description } = req.body;
  try {
    const niveau = await Niveau.findById(niveauId);
    if (!niveau) {
      throw new Error('Niveau non trouvé');
    }
    niveau.nom = nom;
    niveau.description = description;
    niveau.xpRequis = xpRequis;
    const updatedNiveau = await niveau.save();
    res.status(200).json(updatedNiveau);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports.deleteNiveau = async (req, res) => {
  const niveauId = req.params.id;
  try {
    const niveau = await Niveau.findById(niveauId);
    if (!niveau) {
      throw new Error('Niveau non trouvé');
    }
    await Niveau.findByIdAndDelete(niveauId);
    res.status(200).json({ message: 'Niveau supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports.verificationNiveau = async (id, req, res) => {
  try {
    const xp = await XP.findOne({ user: id }).populate('niveauAtteint');

    if (!xp) {
      return res.status(404).json({ message: "XP introuvable" });
    }

    const niveaux = await Niveau.find().sort({ xpRequis: 1 });

    let currentLevel = null;

    for (let i = 0; i < niveaux.length; i++) {
      if (xp.pointsGagnes < niveaux[i].xpRequis) {
        break;
      }
      currentLevel = niveaux[i];
    }

    if (!currentLevel) {
      return res.status(404).json({ message: "Niveau introuvable pour l'XP actuelle" });
    }

    // Mettre à jour le niveau atteint de l'utilisateur
    xp.niveauAtteint = currentLevel;
    await xp.save();

    // res.status(200).json(currentLevel); // Retourner le niveau actuel de l'utilisateur
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

