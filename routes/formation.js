const express = require('express');
const router = express.Router();
const formationController = require('../controllers/formationController');
const upload = require("../middlewares/uploadFils/uploadFormations");
const { requireAuthUser } = require('../middlewares/authMiddleware')

// Routes pour les différentes opérations CRUD
router.post('/',requireAuthUser,upload.single("image_Formation"), formationController.createFormation); // Créer une nouvelle formation
router.get('/', formationController.getFormations); // Récupérer toutes les formations
router.get('/FormationByCentre',requireAuthUser , formationController.getFormationsByCentre); // Récupérer toutes les formations
router.get('/FormationByIdCentre/:id',requireAuthUser , formationController.getFormationsById); // Récupérer toutes les formations
router.get('/FormationByIdFormateur/:id',requireAuthUser , formationController.getFormationByIdFormateur); // Récupérer toutes les formations
router.get('/:id', formationController.getFormationById); // Récupérer une formation par son ID
router.put('/:id', requireAuthUser ,upload.single("image_Formation"),formationController.updateFormation); // Mettre à jour une formation
router.delete('/:id', requireAuthUser ,formationController.deleteFormation); // Supprimer une formation

module.exports = router;
