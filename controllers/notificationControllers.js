const User = require('../models/userSchema');
const Notification = require('../models/notificationSchema');

// Créer une nouvelle notification
module.exports.createNotification = async (req, res) => {
  try {
    const { recipient, content, type , url } = req.body;

    const notification = new Notification({ recipient, content, type, url});
    const newNotification = await notification.save();

    // Ajouter la notification à l'utilisateur correspondant
    await User.updateOne({ _id: recipient }, { $push: { notifications: newNotification._id } });

    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.addNotification = async (recipient, content, type ,url, req, res) => {
  try {

    const notification = new Notification({ recipient, content, type ,url });
    const newNotification = await notification.save();

    // Ajouter la notification à l'utilisateur correspondant
    await User.updateOne({ _id: recipient }, { $push: { notifications: newNotification._id } });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer toutes les notifications d'un utilisateur triées par date la plus récente
module.exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 }); // Trie par date de création décroissante (plus récente en premier)
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

module.exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate('recipient');
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Marquer une notification comme lue
module.exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    // Vérifiez si la notification existe
    if (!notification) {
      return res.status(404).json({ message: "Notification introuvable" });
    }

    // Marquez la notification comme lue
    notification.read = true;
    await notification.save();

    res.status(200).json({ message: "Notification marquée comme lue avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.markNotificationAsvu= async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { vu: true }, { new: true });
    if (!notification) {
      return res.status(404).json({ message: "Notification introuvable" });
    }
    res.status(200).json({ message: "Notification marquée comme lue avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
