const Badge = require('../models/badgeSchema');
const fs = require('fs')

// Créer un nouveau badge
exports.createBadge = async (req, res) => {
  try {
    const { filename } = req.file

    const { nom, description } = req.body;
    const badge = new Badge({ nom, description, image_badge: filename });
    const newBadge = await badge.save();

    res.status(201).json(newBadge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les badges
exports.getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find();
    res.status(200).json(badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un badge par son ID
exports.getBadgeById = async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);
    if (!badge) {
      return res.status(404).json({ message: "Badge introuvable" });
    }
    res.status(200).json(badge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un badge
exports.updateBadge = async (req, res) => {
  try {
    const { nom, description } = req.body;
    const id = req.params.id;
    const checkIfBadgeExists = await Badge.findById(id);
    if (!checkIfBadgeExists) {
      throw new Error('Badge non trouvé !');
    }
    const updateFields = {
      nom,
      description,
    };
    if (req.file) {
      const { filename } = req.file;
      updateFields.image_badge = filename;
    }
    const updatedBadge = await Badge.findByIdAndUpdate(id, {
      $set: updateFields,
    }, { new: true });
    res.status(200).json(updatedBadge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

// Supprimer un badge
exports.deleteBadge = async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);
    if (!badge) {
      return res.status(404).json({ message: "Badge introuvable" });
    }
    await Badge.findByIdAndDelete(req.params.id);
    if (badge.image_badge) {
      const imagePath = `public/images/Badges/${badge.image_badge}`;
      fs.unlinkSync(imagePath); // Supprimer le fichier
    }
    res.status(200).json({ message: "Badge supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
