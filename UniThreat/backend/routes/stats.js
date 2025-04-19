const express = require('express');
const router = express.Router();
const Lookup = require('../models/Lookup'); // Adjust path if needed

router.get('/ip-frequency', async (req, res) => {
  try {
    const data = await Lookup.aggregate([
      { $match: { type: 'ip' } },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    res.json(data);
  } catch (err) {
    console.error('Aggregation error:', err);
    res.status(500).json({ error: 'Failed to fetch IP frequency data' });
  }
});

module.exports = router;
