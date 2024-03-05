const Notification = require('../models/notificationSchema');

// Créer une nouvelle notification
module.exports.createNotification = async (req, res) => {
  try {
    const { recipient, content, type } = req.body;

    const notification = new Notification({ recipient, content, type });
    const newNotification = await notification.save();

    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer toutes les notifications
module.exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate('recipient');
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une notification par son ID
module.exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id).populate('recipient');
    if (!notification) {
      return res.status(404).json({ message: "Notification introuvable" });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une notification
module.exports.updateNotification = async (req, res) => {
  try {
    const { content, type } = req.body;
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification introuvable" });
    }
    notification.content = content;
    notification.type = type;
    const updatedNotification = await notification.save();
    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une notification
module.exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification introuvable" });
    }
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Notification supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
