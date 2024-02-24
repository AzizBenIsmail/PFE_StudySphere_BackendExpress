const Niveau = require('../models/niveauSchema');

module.exports.createNiveau = async (req, res) => {
  const { nom, xpRequis } = req.body;
  try {
    const niveau = new Niveau({
      nom: nom,
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
  const { nom, xpRequis } = req.body;
  try {
    const niveau = await Niveau.findById(niveauId);
    if (!niveau) {
      throw new Error('Niveau non trouvé');
    }
    niveau.nom = nom;
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
