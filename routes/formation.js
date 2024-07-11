const express = require('express');
const router = express.Router();
const formationController = require('../controllers/formationController');
const upload = require("../middlewares/uploadFils/uploadFormations");
const { requireAuthUser } = require('../middlewares/authMiddleware')

// Routes pour les différentes opérations CRUD
router.get('/', formationController.getFormations); // Récupérer toutes les formations
router.get('/searchemplacement', formationController.getFormationsByLocation);
router.get('/FormationByDayAndTime', formationController.getFormationsByDayAndTime);
router.get('/FormationByDomaine', formationController.getFormationsDomaine);
router.get('/FormationsByInscriptionByUserAuth', requireAuthUser,formationController.FormationsByInscriptionByUserAuth);
router.get('/RecommandationParLocation',requireAuthUser, formationController.getFormationsRecommender);
router.get('/FormationByCentre',requireAuthUser , formationController.getFormationsByCentre); // Récupérer toutes les formations
router.get('/FormationByIdCentre/:id',formationController.getFormationsById); // Récupérer toutes les formations
router.get('/FormationByIdFormateur/:id', formationController.getFormationByIdFormateur); // Récupérer toutes les formations
router.get('/:id', formationController.getFormationById); // Récupérer une formation par son ID
router.post('/inscription/:formationId',requireAuthUser, formationController.inscription );
router.post('/desinscription/:formationId',requireAuthUser, formationController.desinscription );
router.post('/',requireAuthUser,upload.single("image_Formation"), formationController.createFormation); // Créer une nouvelle formation
router.put('/:id', requireAuthUser ,upload.single("image_Formation"),formationController.updateFormation); // Mettre à jour une formation
router.put('/feedback/:id', requireAuthUser ,formationController.feedback); // Mettre à jour une formation
router.delete('/:id', requireAuthUser ,formationController.deleteFormation); // Supprimer une formation

module.exports = router;
