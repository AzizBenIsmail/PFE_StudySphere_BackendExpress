const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  type: String,
  method: String,
  url: String,
  ip: String,
  referer: String,
  statusCode: Number,
  user_id: String,
  user_nom: String,
  headers: String,
  executionTime: Number,
  body: String,
  timestamp: { type: Date, default: Date.now }
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
