const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  day: Date,
  startTime: String,
  endTime: String,
  label: String,
  meetingUrl: String ,
  guests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Add guests field
});

module.exports = mongoose.model('Event', eventSchema);
