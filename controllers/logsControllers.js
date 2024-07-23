const Log = require('../models/logSchema');

// Fonction pour récupérer la liste des logs
const getLogs = async (req, res) => {
  try {
    const logs = await Log.find(); // Récupérer tous les logs depuis la base de données
    res.status(200).json(logs); // Retourner les logs en format JSON
  } catch (err) {
    console.error('Erreur lors de la récupération des logs :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getLogs,
};
