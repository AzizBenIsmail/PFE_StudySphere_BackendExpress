const Event = require('../models/eventSchema');
const fs = require('fs')

exports.createEvent = async (req, res) => {
  try {
    console.log(req.file)
    console.log(req.body)

    const eventData = {
      ...req.body,
    };
    if (req.file) {
      const { filename } = req.file;
      eventData.image = filename;

    }

    const event = new Event(eventData);
    await event.save();
    res.status(201).send(event);
  } catch (error) {
    res.status(400).send(error);
  }
};


exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getEventById = async (req, res) => {
  const _id = req.params.id;
  try {
    const event = await Event.findById(_id);
    if (!event) {
      return res.status(404).send();
    }
    res.send(event);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateEvent = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'date', 'location'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!event) {
      return res.status(404).send();
    }

    res.send(event);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).send();
    }

    if (event.image) {
      const imagePath = `public/images/Users/${event.image}`;
      fs.unlinkSync(imagePath); // Supprimer le fichier
    }
    res.send(event);
  } catch (error) {
    res.status(500).send(error);
  }
};
