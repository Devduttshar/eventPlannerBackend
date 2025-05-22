const RSVP = require('../models/RSVP');
const Event = require('../models/Event');

// Create or Update RSVP
const updateRSVP = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status
    if (!['going', 'maybe', 'not_going'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid RSVP status'
      });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Find existing RSVP or create new one
    let rsvp = await RSVP.findOneAndUpdate(
      { event: eventId, user: userId },
      { status },
      { new: true, upsert: true }
    );

    // Add RSVP to event if not already present
    if (!event.rsvps.includes(rsvp._id)) {
      event.rsvps.push(rsvp._id);
      await event.save();
    }

    res.status(200).json({
      success: true,
      rsvp,
      message: 'RSVP updated successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already RSVP\'d to this event'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get RSVP status for an event
const getRSVPStatus = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const rsvp = await RSVP.findOne({ event: eventId, user: userId });

    res.status(200).json({
      success: true,
      status: rsvp ? rsvp.status : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all RSVPs for an event
const getEventRSVPs = async (req, res) => {
  try {
    const { eventId } = req.params;

    const rsvps = await RSVP.find({ event: eventId })
      .populate('user', 'name email')
      .select('status user createdAt updatedAt');

    res.status(200).json({
      success: true,
      rsvps
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all events with RSVP status for a user
const getUserEventsWithRSVP = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all RSVPs for the user
    const rsvps = await RSVP.find({ user: userId })
      .populate({
        path: 'event',
        select: 'title description date startTime endTime location image'
      });

    // Format the response
    const eventsWithRSVP = rsvps.map(rsvp => ({
      eventId: rsvp.event._id,
      title: rsvp.event.title,
      description: rsvp.event.description,
      date: rsvp.event.date,
      startTime: rsvp.event.startTime,
      endTime: rsvp.event.endTime,
      location: rsvp.event.location,
      image: rsvp.event.image,
      rsvpStatus: rsvp.status,
      rsvpId: rsvp._id,
      updatedAt: rsvp.updatedAt
    }));

    res.status(200).json({
      success: true,
      data: eventsWithRSVP
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update RSVP status for a specific event
const updateRSVPStatus = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status
    if (!['going', 'maybe', 'not_going'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid RSVP status'
      });
    }

    // Find and update RSVP
    const rsvp = await RSVP.findOneAndUpdate(
      { event: eventId, user: userId },
      { status },
      { new: true }
    );

    if (!rsvp) {
      return res.status(404).json({
        success: false,
        message: 'RSVP not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        eventId,
        rsvpStatus: rsvp.status,
        updatedAt: rsvp.updatedAt
      },
      message: 'RSVP status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  updateRSVP,
  getRSVPStatus,
  getEventRSVPs,
  getUserEventsWithRSVP,
  updateRSVPStatus
};