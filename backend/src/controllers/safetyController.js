// MoveSmart — Safety Controller
import SafetyEvent from '../models/SafetyEvent.js';

export const triggerSOS = async (req, res) => {
  try {
    const event = await SafetyEvent.create({
      user: req.user._id,
      type: 'sos',
      message: 'SOS Emergency Alert triggered',
      location: req.body.location || {},
    });
    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSafetyEvents = async (req, res) => {
  try {
    const events = await SafetyEvent.find({ user: req.user._id }).sort('-createdAt').limit(20);
    res.json({ success: true, count: events.length, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const shareLocation = async (req, res) => {
  try {
    const event = await SafetyEvent.create({
      user: req.user._id,
      type: 'share',
      message: 'Live location shared with trusted contacts',
      location: req.body.location || {},
    });
    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
