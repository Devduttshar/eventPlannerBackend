const express = require('express');
const router = express.Router();
const { auth,isUser, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents
} = require('../controllers/eventController');
const { getUserEventsWithRSVP } = require('../controllers/rsvpController');

// Admin routes (protected)
router.post('/', auth, isAdmin, upload.single('image'), createEvent);
router.put('/:id', auth, isAdmin, upload.single('image'), updateEvent);
router.delete('/:id', auth, isAdmin, deleteEvent);
router.get('/', getAllEvents);

// User events with RSVP
router.get('/userEvents', auth,isUser, getUserEventsWithRSVP);

module.exports = router;