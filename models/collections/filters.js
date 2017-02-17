var mongoose = require('mongoose');

var FiltersModel = mongoose.model('Filter', { type: String, value: String, action: String });

module.exports = FiltersModel;