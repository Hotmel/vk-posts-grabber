var config = require('../../config');

module.exports = (() => {
  if (global.db) {
    return global.db;
  }

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var connection = mongoose.connect(config.db_url);

  var users = new Schema({
    tgId: Number,
    vkId: Number,
    hash: String
  });

  global.db = {
    mongoose: mongoose,
    users: mongoose.model('users', users)
  }
})();
