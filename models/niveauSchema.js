const mongoose = require('mongoose');

const niveauSchema = new mongoose.Schema({
  nom: {type: String,required: true},
  xpRequis: {type: Number,required: true}

});

const Niveau = mongoose.model('Niveau', niveauSchema);

module.exports = Niveau;
