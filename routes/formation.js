const express = require('express');
const router = express.Router();
const formationController = require('../controllers/formationController');
const upload = require("../middlewares/uploadFils/uploadImagesUsers");

// Routes pour les différentes opérations CRUD
router.post('/',upload.single("image_Formation"), formationController.createFormation); // Créer une nouvelle formation
router.get('/', formationController.getFormations); // Récupérer toutes les formations
router.get('/:id', formationController.getFormationById); // Récupérer une formation par son ID
router.put('/:id', formationController.updateFormation); // Mettre à jour une formation
router.delete('/:id', formationController.deleteFormation); // Supprimer une formation

module.exports = router;
