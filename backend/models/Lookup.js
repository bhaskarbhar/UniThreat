const mongoose = require('mongoose');

const lookupSchema = new mongoose.Schema({
  type: { type: String, enum: ['ip', 'url', 'domain', 'hash'], required: true },
  query: { type: String, required: true },
  result: { type: mongoose.Schema.Types.Mixed }, // Stores raw API response
  flagged: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lookup', lookupSchema);
