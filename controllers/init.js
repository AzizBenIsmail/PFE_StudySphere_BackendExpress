// Importer les modèles Mongoose requis
const User = require('../models/userSchema')
const XP = require('../models/xpSchema')
const Niveau = require('../models/niveauSchema')
const Badge = require('../models/badgeSchema')
const Formation = require('../models/formationSchema')


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
      const defaultformateurBenIsamil = new User({
        nom: 'BenIsmail',
        prenom: 'Mohamed Aziz',
        email: 'benismail@Studysphere.com',
        password: 'Sam3oulation', // Assurez-vous de crypter le mot de passe dans un environnement de production
        image_user: 'BenIsmail.png',
        etat : true,
        role: 'formateur', // ou le rôle que vous souhaitez attribuer
      });
      const defaultformateurCharada = new User({
        nom: 'charada',
        prenom: 'Mohamed Aziz',
        email: 'charada@Studysphere.com',
        password: 'Sam3oulation', // Assurez-vous de crypter le mot de passe dans un environnement de production
        image_user: 'charada.png',
        etat : true,
        role: 'formateur', // ou le rôle que vous souhaitez attribuer
      });
      const defaultformateurHbiba = new User({
        nom: 'hbiba',
        prenom: 'Mzoghi',
        email: 'hbiba@Studysphere.com',
        password: 'Sam3oulation', // Assurez-vous de crypter le mot de passe dans un environnement de production
        image_user: 'hbiba.jpg',
        etat : true,
        role: 'formateur', // ou le rôle que vous souhaitez attribuer
      });
      const defaultformateurImen= new User({
        nom: 'imen',
        prenom: 'miladi',
        email: 'imen@Studysphere.com',
        password: 'Sam3oulation', // Assurez-vous de crypter le mot de passe dans un environnement de production
        image_user: 'imen.jpeg',
        etat : true,
        role: 'formateur', // ou le rôle que vous souhaitez attribuer
      });
      const default9antra = new User({
        nom: '9antra',
        email: '9antra@Studysphere.com',
        password: 'Sam3oulation', // Assurez-vous de crypter le mot de passe dans un environnement de production
        image_user: '9antra.png',
        etat : true,
        role: 'centre', // ou le rôle que vous souhaitez attribuer
      });
      const defaultGomycode = new User({
        nom: 'Gomycode',
        email: 'Gomycode@Studysphere.com',
        password: 'Sam3oulation', // Assurez-vous de crypter le mot de passe dans un environnement de production
        image_user: 'Gomycode.png',
        etat : true,
        role: 'centre', // ou le rôle que vous souhaitez attribuer
      });
      const defaultcircle = new User({
        nom: 'Circles',
        email: 'Circles@Studysphere.com',
        password: 'Sam3oulation', // Assurez-vous de crypter le mot de passe dans un environnement de production
        image_user: 'Circles.png',
        etat : true,
        role: 'centre', // ou le rôle que vous souhaitez attribuer
      });
      await defaultAdmin.save();
      await defaultUser.save();
      await default9antra.save();
      await defaultGomycode.save();
      await defaultcircle.save();
      await defaultformateurBenIsamil.save();
      await defaultformateurCharada.save();
      await defaultformateurImen.save();
      await defaultformateurHbiba.save();

      // console.log('Utilisateur par défaut créé avec succès.');
    } else {
      // console.log('Des utilisateurs existent déjà. Aucun utilisateur par défaut n\'a été créé.');
    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur par défaut :', error);
  }
};

const createDefaultFormation = async () => {
  try {
    const existingFormation = await Formation.find();
    if (existingFormation.length === 0) {
      // Récupérer les ID du centre et du formateur depuis la base de données
      const centerUser = await User.findOne({ nom: '9antra', role: 'centre' });
      const formateurUser = await User.findOne({ nom: 'BenIsmail', role: 'formateur' });

      const Gomycode = await User.findOne({ nom: 'Gomycode', role: 'centre' });
      const charada = await User.findOne({ nom: 'charada', role: 'formateur' });

      const Circles = await User.findOne({ nom: 'Circles', role: 'centre' });
      const imen = await User.findOne({ nom: 'imen', role: 'formateur' });

      const hbiba = await User.findOne({ nom: 'hbiba', role: 'formateur' });

      if (!centerUser || !formateurUser) {
        console.error('Centre ou formateur par défaut non trouvé.');
        return;
      }

      const Nodejs = {
        titre: 'Formation Backend NodeJs',
        description: 'Formation Backend NodeJs ExressJs MERN',
        image_Formation: 'Nodejs.jpg',
        niveauRequis: 'Intermédiaire',
        niveauDengagementRequis: 'Élevé',
        competences: 'Connaissance de base en JavaScript',
        niveauDeDifficulte: 'Moyen',
        styleEnseignement: 'En ligne',
        Prix: 'Gratuit',
        jours: 'Lundi, Mercredi, Vendredi',
        typeContenu: 'Vidéos, Exercices pratiques',
        langue: 'Français',
        emplacement: 'En ligne',
        sujetInteret: 'Développement web',
        Tranches_Horaires: 'Matin',
        duree: 60, // en minutes
        dateDebut: new Date('2024-04-01'),
        dateFin: new Date('2024-06-01'),
        centre: centerUser._id,
        formateur: formateurUser._id,
      };

      const FlutterFormation = {
        titre: 'Formation Flutter',
        description: 'Formation sur le développement mobile avec Flutter',
        image_Formation: 'flutter.jpg',
        niveauRequis: 'Débutant',
        niveauDengagementRequis: 'Modéré',
        competences: 'Connaissance de base en programmation',
        niveauDeDifficulte: 'Facile',
        styleEnseignement: 'En ligne',
        Prix: 'Gratuit',
        jours: 'Mardi, Jeudi',
        typeContenu: 'Cours, Projets pratiques',
        langue: 'Anglais',
        emplacement: 'En ligne',
        sujetInteret: 'Développement mobile',
        Tranches_Horaires: 'Soirée',
        duree: 90, // en minutes
        dateDebut: new Date('2024-05-01'),
        dateFin: new Date('2024-07-01'),
        centre: centerUser._id,
        formateur: imen._id,
      };

      const BIFormation = {
        titre: 'Formation Business Intelligence',
        description: 'Formation sur les bases de la Business Intelligence',
        image_Formation: 'bi.jpg',
        niveauRequis: 'Intermédiaire',
        niveauDengagementRequis: 'Élevé',
        competences: 'Connaissance en base de données',
        niveauDeDifficulte: 'Moyen',
        styleEnseignement: 'En ligne',
        Prix: 'Payant',
        jours: 'Lundi, Mercredi, Vendredi',
        typeContenu: 'Cours, Études de cas',
        langue: 'Français',
        emplacement: 'En ligne',
        sujetInteret: 'Analyse des données',
        Tranches_Horaires: 'Matinée',
        duree: 120, // en minutes
        dateDebut: new Date('2024-06-01'),
        dateFin: new Date('2024-08-01'),
        centre: Circles._id,
        formateur: hbiba._id,
      };

      const springBootFormation = {
        titre: 'Formation Spring Boot',
        description: 'Formation sur le développement avec Spring Boot',
        image_Formation: 'springboot.jpg',
        niveauRequis: 'Intermédiaire',
        niveauDengagementRequis: 'Élevé',
        competences: 'Connaissance en Java, bases de données',
        niveauDeDifficulte: 'Moyen',
        styleEnseignement: 'En ligne',
        Prix: 'Payant',
        jours: 'Mardi, Jeudi, Samedi',
        typeContenu: 'Cours, Projets pratiques',
        langue: 'Anglais',
        emplacement: 'En ligne',
        sujetInteret: 'Développement Web',
        Tranches_Horaires: 'Soirée',
        duree: 90, // en minutes
        dateDebut: new Date('2024-07-01'),
        dateFin: new Date('2024-09-01'),
        centre: Gomycode._id,
        formateur: charada._id,
      };

      const angularFormation = {
        titre: 'Formation Angular',
        description: 'Formation sur le développement avec Angular',
        image_Formation: 'angular.jpg',
        niveauRequis: 'Intermédiaire',
        niveauDengagementRequis: 'Élevé',
        competences: 'Connaissance en HTML, CSS, JavaScript',
        niveauDeDifficulte: 'Moyen',
        styleEnseignement: 'En ligne',
        Prix: 'Payant',
        jours: 'Lundi, Mercredi, Vendredi',
        typeContenu: 'Cours, Projets pratiques',
        langue: 'Anglais',
        emplacement: 'En ligne',
        sujetInteret: 'Développement Web',
        Tranches_Horaires: 'Soirée',
        duree: 90, // en minutes
        dateDebut: new Date('2024-07-01'),
        dateFin: new Date('2024-09-01'),
        centre: centerUser._id,
        formateur: charada._id,
      };

      const FormationNodejs = new Formation(Nodejs);
      await FormationNodejs.save();

      const FormationSpringBoot = new Formation(springBootFormation);
      await FormationSpringBoot.save();

      const FormationBI = new Formation(BIFormation);
      await FormationBI.save();

      const FormationFlutter = new Formation(FlutterFormation);
      await FormationFlutter.save();

      const FormationAngular = new Formation(angularFormation);
      await FormationAngular.save();

      console.log('Formation par défaut créée avec succès.');
    } else {
      console.log('Des formations existent déjà. Aucune formation par défaut n\'a été créée.');
    }
  } catch (error) {
    console.error('Erreur lors de la création de la formation par défaut :', error);
  }
};

// Appeler la fonction pour créer la formation par défaut


// Appeler les fonctions pour créer le niveau et l'utilisateur par défaut
const createDefaultData = async () => {
  await createDefaultBadge();
  await createDefaultNiveau();
  await createDefaultUser();
  await createDefaultFormation();

};

// Appeler la fonction pour créer les données par défaut
createDefaultData();
