const Event = require("../models/eventSchema.js");

module.exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('guests');
    res.status(200).json(events);
  } catch (err) {
    console.error("Error in getAllEvents controller:", err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports.createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error("Error in createEvent controller:", err.message);
    res.status(400).json({ message: err.message });
  }
};

module.exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, req.body, { new: true });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (err) {
    console.error("Error in updateEvent controller:", err.message);
    res.status(400).json({ message: err.message });
  }
};

module.exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error in deleteEvent controller:", err.message);
    res.status(400).json({ message: err.message });
  }
};
