const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['going', 'maybe', 'not_going'],
    required: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate RSVPs
rsvpSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('RSVP', rsvpSchema);