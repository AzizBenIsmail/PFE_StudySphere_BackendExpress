const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/logsControllers');

// Route pour récupérer les logs
router.get('/', getLogs);

module.exports = router;
