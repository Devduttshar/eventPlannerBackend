const express = require('express');
const router = express.Router();
const { auth, isUser, isAdmin } = require('../middleware/auth');
const {
  updateRSVP,
  getRSVPStatus,
  getEventRSVPs,
  getUserEventsWithRSVP,
  updateRSVPStatus
} = require('../controllers/rsvpController');

// RSVP routes
router.post('/:eventId/rsvp', auth, isUser, updateRSVP);
router.get('/:eventId/rsvp', auth, getRSVPStatus);
router.get('/:eventId/rsvps', auth, isAdmin, getEventRSVPs);
router.put('/:eventId/rsvp-status', auth, isUser, updateRSVPStatus);

module.exports = router;