var mongoose = require('mongoose');

mongoose.connect('mongodb://fizlin:123456@ds145299.mlab.com:45299/filterproxy');

var FiltersModel = mongoose.model('Filter', { type: String, value: String, action: String });

module.exports = FiltersModel;