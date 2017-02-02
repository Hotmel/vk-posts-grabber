var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newUsersSchema = new Schema({
  id: Number
});

module.exports = mongoose.model('newUsers', newUsersSchema);