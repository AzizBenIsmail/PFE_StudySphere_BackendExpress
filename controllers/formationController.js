const Formation = require('../models/formationSchema');

// Controller pour créer une nouvelle formation
exports.createFormation = async (req, res) => {
  try {
    const formation = await Formation.create(req.body);
    res.status(201).json({   formation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller pour récupérer toutes les formations
exports.getFormations = async (req, res) => {
  try {
    const formations = await Formation.find();
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

// Controller pour mettre à jour une formation existante
exports.updateFormation = async (req, res) => {
  try {
    const formation = await Formation.findByIdAndUpdate(req.params.id, req.body, {
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
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
