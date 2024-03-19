// Importer les modèles Mongoose requis
const User = require('../models/userSchema')
const XP = require('../models/xpSchema')
const Niveau = require('../models/niveauSchema')
const Badge = require('../models/badgeSchema')


// Fonction pour créer un niveau par défaut
const createDefaultNiveau = async () => {
  try {
    const existingNiveaux = await Niveau.find();
    if (existingNiveaux.length === 0) {
      const defaultNiveau = new Niveau({
        nom: 'Niveau0',
        description: 'lors de l\'inscription',
        xpRequis: 0
      });
      const Niveau1 = new Niveau({
        nom: 'Niveau1',
        description: 'Apres la creation de ces preference ',
        xpRequis: 100
      });
      const Niveau2 = new Niveau({
        nom: 'Niveau2',
        description: 'lors de l\'inscription',
        xpRequis: 200
      });
      const Niveau3 = new Niveau({
        nom: 'Niveau3',
        description: 'lors de l\'inscription',
        xpRequis: 300
      });
      const Niveau4 = new Niveau({
        nom: 'Niveau4',
        description: 'lors de l\'inscription',
        xpRequis: 400
      });
      const Niveau5 = new Niveau({
        nom: 'Niveau5',
        description: 'lors de l\'inscription',
        xpRequis: 500
      });
      const Niveau6 = new Niveau({
        nom: 'Niveau6',
        description: 'lors de l\'inscription',
        xpRequis: 600
      });
      const Niveau7 = new Niveau({
        nom: 'Niveau7',
        description: 'lors de l\'inscription',
        xpRequis: 700
      });
      const Niveau8 = new Niveau({
        nom: 'Niveau8',
        description: 'lors de l\'inscription',
        xpRequis: 800
      });
      const Niveau9 = new Niveau({
        nom: 'Niveau9',
        description: 'lors de l\'inscription',
        xpRequis: 900
      });
      const Niveau10 = new Niveau({
        nom: 'Niveau10',
        description: 'lors de l\'inscription',
        xpRequis: 1000
      });

      await defaultNiveau.save();
      await Niveau1.save();
      await Niveau2.save();
      await Niveau3.save();
      await Niveau4.save();
      await Niveau5.save();
      await Niveau6.save();
      await Niveau7.save();
      await Niveau8.save();
      await Niveau9.save();
      await Niveau10.save();

      // console.log('Niveau par défaut créé avec succès.');
    } else {
      // console.log('Des niveaux existent déjà. Aucun niveau par défaut n\'a été créé.');
    }
  } catch (error) {
    console.error('Erreur lors de la création du niveau par défaut :', error);
  }
};

// Fonction pour créer un seul badge par défaut
const createDefaultBadge = async () => {
  try {
    const existingBadges = await Badge.find();
    if (existingBadges.length === 0) {
      const BadgeBienvenu = {
        nom: 'Bienvenu',
        description: 'badge par défaut',
        image_badge: 'Bienvenu.png' // Remplacez par l'URL réelle de l'image du badge
      };

      const BadgeRecommendation = {
        nom: 'Recommendation',
        description: 'badge pour remplier le formulaire de Recommendation',
        image_badge: 'Recommendation.png' // Remplacez par l'URL réelle de l'image du badge
      };

      const Bienvenu = new Badge(BadgeBienvenu);
      await Bienvenu.save();

      const Recommendation = new Badge(BadgeRecommendation);
      await Recommendation.save();

      // console.log('Badge par défaut créé avec succès.');
    } else {
      // console.log('Des badges existent déjà. Aucun badge par défaut n\'a été créé.');
    }
  } catch (error) {
    console.error('Erreur lors de la création du badge par défaut :', error);
  }
};

// Fonction pour créer un utilisateur par défaut
const createDefaultUser = async () => {
  try {
    const existingUsers = await User.find();
    if (existingUsers.length === 0) {
      const defaultAdmin = new User({
        nom: 'Administrateur',
        email: 'admin@Studysphere.com',
        password: 'Sam3oulation', // Assurez-vous de crypter le mot de passe dans un environnement de production
        image_user: 'administrateur.png',
        etat : true,
        role: 'admin', // ou le rôle que vous souhaitez attribuer
      });
      const defaultUser = new User({
        nom: 'Client',
        prenom: 'Studysphere',
        email: 'client@Studysphere.com',
        password: 'Sam3oulation', // Assurez-vous de crypter le mot de passe dans un environnement de production
        image_user: 'client.png',
        etat : true,
        role: 'client', // ou le rôle que vous souhaitez attribuer
      });

      await defaultAdmin.save();
      await defaultUser.save();

      // console.log('Utilisateur par défaut créé avec succès.');
    } else {
      // console.log('Des utilisateurs existent déjà. Aucun utilisateur par défaut n\'a été créé.');
    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur par défaut :', error);
  }
};

// Appeler les fonctions pour créer le niveau et l'utilisateur par défaut
const createDefaultData = async () => {
  await createDefaultBadge();
  await createDefaultNiveau();
  await createDefaultUser();
};

// Appeler la fonction pour créer les données par défaut
createDefaultData();
