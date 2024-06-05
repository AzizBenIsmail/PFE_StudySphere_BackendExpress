const mongoose = require('mongoose');

const formationFavorisSchema = new mongoose.Schema({
  formation: { type: mongoose.Schema.Types.ObjectId, ref: 'Formation', required: true },
  utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateAjout: { type: Date, default: Date.now }, // Date à laquelle la formation a été ajoutée aux favoris
  note: { type: Number, min: 1, max: 5 }, // Note attribuée à la formation
  commentaire: String, // Commentaire sur la formation
  partage: { type: Boolean, default: false }, // Indique si l'utilisateur a partagé cette formation
});

const FormationFavoris = mongoose.model('FormationFavoris', formationFavorisSchema);

module.exports = FormationFavoris;
