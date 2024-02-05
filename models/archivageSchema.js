const mongoose = require('mongoose');

const archivageSchema = new mongoose.Schema({
  dateArchivage: Date,
  raison: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User
  archi: Boolean , // New boolean field
});

const Archivage = mongoose.model('Archivage', archivageSchema);

module.exports = Archivage;
