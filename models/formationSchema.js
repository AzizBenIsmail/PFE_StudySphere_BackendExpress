const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  image_Formation: String,
  description: { type: String, required: true },
  niveauRequis: { type: String, required: true },
  niveauDengagementRequis: { type: String, required: true },
  competences: { type: String, required: true },
  niveauDeDifficulte: { type: String, required: true },
  styleEnseignement: { type: String, required: true },
  Prix: { type: String, required: true },
  jours: { type: String, required: true },
  typeContenu: { type: String, required: true },
  langue: { type: String, required: true },
  emplacement: { type: String, required: true },
  sujetInteret: { type: String, required: true },
  Tranches_Horaires: { type: String, required: true },
  duree: { type: Number, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  centre: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  formateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  feedbacks: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number, required: true, min: 0, max: 5 }
  }],
  averageFeedback: { type: Number, default: 0 }
});

const Formation = mongoose.model('Formation', formationSchema);

module.exports = Formation;
