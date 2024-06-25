const mongoose = require('mongoose');

const userLogSchema = new mongoose.Schema({
   user: String,
   action: String,
   details: String,
   timestamp: { type: Date, default: Date.now },
   role: { type: String, default: 'Admin' }
});

module.exports = mongoose.model('UserLog', userLogSchema);