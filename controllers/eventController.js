const Event = require('../models/Event');
const RSVP = require('../models/RSVP');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// Create Event
const createEvent = async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, location } = req.body;
    
    let imageData = null;
    if (req.file) {
      imageData = await uploadToCloudinary(req.file);
    }
    
    const event = await Event.create({
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      image: imageData,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      event,
      message: 'Event created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Event
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (req.file) {
      // Delete old image if exists
      if (event.image && event.image.public_id) {
        await deleteFromCloudinary(event.image.public_id);
      }
      // Upload new image
      const imageData = await uploadToCloudinary(req.file);
      req.body.image = imageData;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      event: updatedEvent,
      message: 'Event updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Delete image from Cloudinary if exists
    if (event.image && event.image.public_id) {
      await deleteFromCloudinary(event.image.public_id);
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name email');
    const formattedEvents = events.map(event => ({
      eventId: event._id,
      title: event.title,
      description: event.description,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      image: event.image,
      createdBy: event.createdBy,
      updatedAt: event.updatedAt
    }));

    return res.status(200).json({
      success: true,
      events: formattedEvents,
      message: 'Events fetched successfully'
    });
  } catch (error) {
    console.error('GetAllEvents Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents
};