const mongoose = require('mongoose');

const favorisSchema = new mongoose.Schema({
  formation: { type: mongoose.Schema.Types.ObjectId, ref: 'Formation', required: true },
  utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateAjout: { type: Date, default: Date.now },
});

// Ajouter un index unique pour garantir qu'une combinaison utilisateur-formation est unique
favorisSchema.index({ formation: 1, utilisateur: 1 }, { unique: true });

const Favoris = mongoose.model('Favoris', favorisSchema);

module.exports = Favoris;
