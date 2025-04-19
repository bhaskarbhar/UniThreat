router.get('/stats/ip-frequency', async (req, res) => {
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
  });
  