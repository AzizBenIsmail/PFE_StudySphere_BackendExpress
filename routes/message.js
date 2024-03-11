const express = require('express');
const { getMessages, sendMessage } = require('../controllers/messageControllers.js');
const { requireAuthUser } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get("/:id", requireAuthUser, getMessages);
router.post("/send/:id", requireAuthUser, sendMessage);

module.exports = router;
