var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
  id: Number,
  vk_id: Number,
  hash: String
});

module.exports = mongoose.model('users', usersSchema);