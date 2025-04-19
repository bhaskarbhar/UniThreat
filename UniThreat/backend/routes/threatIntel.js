const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();
const Lookup = require('../models/Lookup'); // Adjust the path as necessary

// Helper function to assign severity based on response data
function assignSeverity(responseData, type) {
  let severity = 'Low';

  if (type === 'ip') {
    if (responseData.data?.abuseConfidenceScore > 80) {
      severity = 'High';
    } else if (responseData.data?.abuseConfidenceScore > 50) {
      severity = 'Medium';
    } else {
      severity = 'Low';
    }
  }

  if (type === 'url') {
    if (responseData.url?.is_malicious) {
      severity = 'High';
    } else {
      severity = 'Low';
    }
  }

  if (type === 'hash') {
    if (responseData.data?.attributes?.last_analysis_stats?.malicious > 50) {
      severity = 'High';
    } else if (responseData.data?.attributes?.last_analysis_stats?.malicious > 10) {
      severity = 'Medium';
    } else {
      severity = 'Low';
    }
  }

  if (type === 'domain') {
    if (responseData.some_condition) {
      severity = 'High';
    } else {
      severity = 'Low';
    }
  }

  return severity;
}

// /check-ip route
router.post('/check-ip', async (req, res) => {
  const { ip } = req.body;
  try {
    const response = await axios.get('https://api.abuseipdb.com/api/v2/check', {
      params: {
        ipAddress: ip,
        maxAgeInDays: 90
      },
      headers: {
        'Key': process.env.ABUSEIPDB_API_KEY,
        'Accept': 'application/json'
      }
    });

    const severity = assignSeverity(response.data, 'ip');

    await Lookup.create({
      type: 'ip',
      query: ip,
      result: response.data,
      flagged: response.data.data?.abuseConfidenceScore > 0,
      severity
    });

    res.json({ ...response.data, severity });
  } catch (err) {
    res.status(500).json({ message: 'Error checking IP', error: err.message });
  }
});

router.post('/check-url', async (req, res) => {
  const { url } = req.body;
  try {
    const urlHausApiUrl = 'https://urlhaus-api.abuse.ch/v1/url/';
    const response = await axios.post(urlHausApiUrl, new URLSearchParams({ url: url }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Error checking URL', error: err.message });
  }
});

// /check-hash route
router.post('/check-hash', async (req, res) => {
  const { hash } = req.body;
  try {
    const response = await axios.get(`https://www.virustotal.com/api/v3/files/${hash}`, {
      headers: {
        'x-apikey': process.env.VIRUSTOTAL_API_KEY
      }
    });

    const severity = assignSeverity(response.data, 'hash');

    await Lookup.create({
      type: 'hash',
      query: hash,
      result: response.data,
      flagged: response.data.data?.attributes?.last_analysis_stats?.malicious > 0,
      severity
    });

    res.json({ ...response.data, severity });
  } catch (err) {
    res.status(500).json({ message: 'Error checking hash', error: err.message });
  }
});

// /check-domain route
router.post('/check-domain', async (req, res) => {
  const { domain } = req.body;
  try {
    const response = await axios.post('https://threatfox-api.abuse.ch/api/v1/', {
      query: 'search_ioc',
      search_term: domain
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const severity = assignSeverity(response.data, 'domain');

    await Lookup.create({
      type: 'domain',
      query: domain,
      result: response.data,
      flagged: response.data.some_condition,
      severity
    });

    res.json({ ...response.data, severity });
  } catch (err) {
    res.status(500).json({ message: 'Error checking domain', error: err.message });
  }
});

// /get-history route - Get last 10 lookups
router.get('/get-history', async (req, res) => {
  try {
    const lookups = await Lookup.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(lookups);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching history', error: err.message });
  }
});

// /search-history route - Search/filter history
router.get('/search-history', async (req, res) => {
  const { query, type } = req.query;

  try {
    let filter = {};

    if (query) {
      filter.query = new RegExp(query, 'i');
    }

    if (type) {
      filter.type = type;
    }

    const lookups = await Lookup.find(filter)
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(lookups);
  } catch (err) {
    res.status(500).json({ message: 'Error searching history', error: err.message });
  }
});

module.exports = router;
