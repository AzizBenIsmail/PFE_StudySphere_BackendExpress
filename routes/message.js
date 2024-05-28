const express = require('express');
const router = express.Router();
const message = require('../controllers/messageControllers.js');
const { requireAuthUser } = require('../middlewares/authMiddleware');



router.get("/:id", requireAuthUser, message.getMessages);
router.post("/send/:id", requireAuthUser, message.sendMessage);

module.exports = router;
