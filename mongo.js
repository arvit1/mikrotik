var mongoose = require('mongoose');

var conn = mongoose.createConnection('mongodb://localhost:27017/mikrotik'); // connect to our database
module.exports = conn;