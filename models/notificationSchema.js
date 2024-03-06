const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  content: { type: String, required: true },
  type: { type: String,  enum: ['message', 'activity', 'update'],  },
  read: { type: Boolean, default: false  },
  vu: { type: Boolean, default: false  },
  createdAt: { type: Date, default: Date.now },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
