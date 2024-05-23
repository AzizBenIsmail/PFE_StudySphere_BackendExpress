// routes/calendar.js
const express = require("express");
const router = express.Router();
const Event = require("../models/event.js");
const { requireAuthUser } = require('../middlewares/authMiddleware');

// Get all events
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create an event
router.post("/events", requireAuthUser, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();

    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an event
router.put("/events/:id", requireAuthUser, async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, req.body, { new: true });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an event
router.delete("/events/:id", requireAuthUser, async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
