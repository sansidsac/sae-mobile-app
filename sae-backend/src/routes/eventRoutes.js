const express = require('express');
const User = require('../models/User');
const Event = require('../models/Event');
const UserEvent = require('../models/UserEvent');
const UserLocation = require('../models/UserLocation');

const router = express.Router();

const toNumber = (value) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return parsed;
};

const toDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
};

router.post('/post_user', async (req, res) => {
  try {
    const id = toNumber(req.body.id);
    const { name, clg_name } = req.body;

    if (id === null || !name || !clg_name) {
      return res.status(400).json({ message: 'id, name, clg_name are required' });
    }

    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return res.status(409).json({ message: 'user already exists' });
    }

    const user = await User.create({ id, name, clg_name });

    await UserLocation.updateOne(
      { user_id: id },
      {
        $setOnInsert: {
          user_id: id,
          geofence: { lat: 0, long: 0, radius: 0 },
          status: 'out',
          timestamp: new Date()
        }
      },
      { upsert: true }
    );

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/get_user/:id', async (req, res) => {
  try {
    const id = toNumber(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: 'invalid id' });
    }

    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/get_event/:id', async (req, res) => {
  try {
    const id = toNumber(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: 'invalid id' });
    }

    const event = await Event.findOne({ id });
    if (!event) {
      return res.status(404).json({ message: 'event not found' });
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.patch('/patch_user_event', async (req, res) => {
  try {
    const user_id = toNumber(req.body.user_id);
    const event_id = toNumber(req.body.event_id);
    const { attended } = req.body;

    if (user_id === null || event_id === null || !attended) {
      return res.status(400).json({ message: 'user_id, event_id, attended are required' });
    }

    if (attended !== 'yes' && attended !== 'no') {
      return res.status(400).json({ message: 'attended must be yes or no' });
    }

    let timestamp_attended = new Date();
    if (req.body.timestamp_attended !== undefined) {
      const parsed = toDate(req.body.timestamp_attended);
      if (!parsed) {
        return res.status(400).json({ message: 'invalid timestamp_attended' });
      }
      timestamp_attended = parsed;
    }

    const userEvent = await UserEvent.findOneAndUpdate(
      { user_id, event_id },
      { $set: { attended, timestamp_attended } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json(userEvent);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/get_user_event', async (req, res) => {
  try {
    const filter = {};

    if (req.query.user_id !== undefined) {
      const userId = toNumber(req.query.user_id);
      if (userId === null) {
        return res.status(400).json({ message: 'invalid user_id' });
      }
      filter.user_id = userId;
    }

    if (req.query.event_id !== undefined) {
      const eventId = toNumber(req.query.event_id);
      if (eventId === null) {
        return res.status(400).json({ message: 'invalid event_id' });
      }
      filter.event_id = eventId;
    }

    if (filter.user_id !== undefined && filter.event_id !== undefined) {
      const userEvent = await UserEvent.findOne(filter);
      if (!userEvent) {
        return res.status(404).json({ message: 'user_event not found' });
      }
      return res.status(200).json(userEvent);
    }

    const userEvents = await UserEvent.find(filter);
    return res.status(200).json(userEvents);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/get_user_location', async (req, res) => {
  try {
    if (req.query.user_id !== undefined) {
      const userId = toNumber(req.query.user_id);
      if (userId === null) {
        return res.status(400).json({ message: 'invalid user_id' });
      }

      const userLocation = await UserLocation.findOne({ user_id: userId });
      if (!userLocation) {
        return res.status(404).json({ message: 'user_location not found' });
      }

      return res.status(200).json(userLocation);
    }

    const userLocations = await UserLocation.find({});
    return res.status(200).json(userLocations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;

