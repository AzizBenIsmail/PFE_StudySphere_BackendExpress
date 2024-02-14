const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
  domaine: String,
  emplacement_actuelle: String,
  langue: String,
  reputation: { type: Number, default: 0 },
});

const Preferences = mongoose.model('Preferences', preferencesSchema);

module.exports = Preferences;
