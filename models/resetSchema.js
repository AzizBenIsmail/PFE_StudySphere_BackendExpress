const mongoose = require('mongoose');

const resetSchema = new mongoose.Schema({
  resetId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const ResetModel = mongoose.model('Reset', resetSchema);
module.exports = ResetModel;
