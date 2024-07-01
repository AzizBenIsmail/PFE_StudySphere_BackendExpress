var express = require("express");
var router = express.Router();
const favorisControllers = require('../controllers/favorisControllers');
const { requireAuthUser } = require('../middlewares/authMiddleware'); // Middleware d'authentification

router.get('/', requireAuthUser, favorisControllers.getFavoris);
router.post('/', requireAuthUser, favorisControllers.addFavori);
router.delete('/:favoriId', requireAuthUser, favorisControllers.removeFavori);

module.exports = router;
