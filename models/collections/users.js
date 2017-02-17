var mongoose = require('mongoose');

var UsersModel = mongoose.model('User', { email: String, password: String });

module.exports = FiltersModel;