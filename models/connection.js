var mongoose = require('mongoose');

mongoose.connect('mongodb://fizlin:123456@ds145299.mlab.com:45299/filterproxy');

var db = mongoose.connection;

module.exports = db;