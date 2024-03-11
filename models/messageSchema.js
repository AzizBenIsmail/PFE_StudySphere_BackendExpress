const mongoose = require("mongoose");



const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
  },
  file: {
    data: Buffer, // Store file as Buffer
    contentType: String, // Store file content type
    path: String, // Store file path
    originalname: String,
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
