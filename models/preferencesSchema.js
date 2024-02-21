const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
  //General
  domaine_actuelle: String, //"rh", "info", "archi",
  objectifs_de_carriere: String, //"Changer de carrière vers l'informatique", "Obtenir une promotion",
  Domaine_dinteret: String, //"Informatique", "Langues", "Finance"
  competences_dinteret: String, //"communication", "Langues", "Finance","Programmation Java", "Conception graphique
  niveau_dexperience_professionnelle: String, // le nombre d'années travaillées dans un domaine spécifique
  interets_personnels : String , //(musique, sports, arts, etc.)
  date_anniversaire: String, // 2000
  //Niveau
  niveau_etude: String, //"Secondaire", "Baccalauréat", "Maîtrise",
  niveau_dengagement : String, // "consacrer du temps régulier à la formation 4S" , "sessions d'apprentissage plus courtes 2S" , "intermittentes 1S"
  besoin : String, //certification ou une reconnaissance officielle à la fin du programme,
  niveau_de_difficulte: String,
  //detais preference
  emplacement_actuelle: String,
  style_dapprentissage: String, // "enligne" , "presentiel" , "hybride"
  duree_preferee: String, // l'automne , l'hiver , printemps, l'été,
  budget: String, //connaître le budget de l'utilisateur
  disponibilite: String, //comme les jours de la semaine ou les heures de la journée où il est le plus disponible pour étudier.
  type_de_contenu_prefere: String, //(cours interactifs, workshop, projet , Travaille en groupe etc.),
  preferences_linguistiques : String, // "fr","en","arab"
  //Intérêts_specifiques
  historique_dapprentissage:String, // suivre sont interet

  // reputation: { type: Number, default: 0 },
  // phoneNumber: Number, //length 8
});

const Preferences = mongoose.model('Preferences', preferencesSchema);

module.exports = Preferences;
