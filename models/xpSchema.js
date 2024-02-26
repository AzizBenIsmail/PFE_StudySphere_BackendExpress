const mongoose = require('mongoose');

const xpSchema = new mongoose.Schema({
  pointsGagnes: {type: Number,required: true},
  // date: {type: Date,default: Date.now},
  source: {type: String,enum: ['connexion quotidienne', 'achèvement d\'un cours', 'autre'], required: true},
  niveauAtteint: { type: mongoose.Schema.Types.ObjectId, ref: 'Niveau', required: true }, // Référence à l'ID du niveau atteint
  badgeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }], // Références à plusieurs badges
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User
});

const XP = mongoose.model('XP', xpSchema);

module.exports = XP;
