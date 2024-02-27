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

      await defaultNiveau.save();

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
      const defaultBadge = {
        nom: 'Bienvenu',
        description: 'badge par défaut',
        image_badge: 'Bienvenu.png' // Remplacez par l'URL réelle de l'image du badge
      };

      // Créer et enregistrer le badge par défaut
      const newBadge = new Badge(defaultBadge);
      await newBadge.save();

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
