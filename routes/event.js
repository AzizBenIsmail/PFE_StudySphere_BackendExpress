const express = require("express");
const router = express.Router();
const { requireAuthUser } = require('../middlewares/authMiddleware');
const {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');

// Get all events
router.get("/events", requireAuthUser, getAllEvents);

// Create an event
router.post("/events", requireAuthUser, createEvent);

// Update an event
router.put("/events/:id", requireAuthUser, updateEvent);

// Delete an event
router.delete("/events/:id", requireAuthUser, deleteEvent);

module.exports = router;
