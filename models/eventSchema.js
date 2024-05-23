// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  day: Date,
  startTime: String,
  endTime: String,
  label: String,
});

module.exports = mongoose.model('Event', eventSchema);
