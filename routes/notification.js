const express = require("express");
const router = express.Router();
const notification = require("../controllers/notificationControllers");
const { requireAuthUser } = require('../middlewares/authMiddleware')

router.post("/",requireAuthUser, notification.createNotification);
router.get("/",requireAuthUser, notification.getAllNotifications);
router.get("/notification/:userId",requireAuthUser, notification.getUserNotifications);
router.get("/:id",requireAuthUser, notification.getNotificationById);
router.put("/:id",requireAuthUser, notification.updateNotification);
router.delete("/:id",requireAuthUser, notification.deleteNotification);
router.put("/:id/read", requireAuthUser, notification.markNotificationAsRead);
router.put('/:id/markAsRead', notification.markNotificationAsRead);

module.exports = router;
