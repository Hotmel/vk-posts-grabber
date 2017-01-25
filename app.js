const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const petrovich = require('petrovich');
const config = require('./config');
const mongoose = require('mongoose');
const assert = require('assert');
const md5 = require('md5');

const urlDb = config.urlDb;
const token = config.token;
const VKtoken = config.VKtoken;

const bot = new TelegramBot(token, { polling: true });

const start = require('./modules/cmd/start')();
const help = require('./modules/cmd/help')();
const parser = require('./modules/cmd/parser')();
const spam = require('./modules/cmd/spam')();

bot.on('message', msg => {
  console.log(`Пользователь @${msg.from.username} написал «${msg.text}»`);

  if (msg.text.match('/start')) {
    start(msg);
  } else if (msg.text == '/help') {
    help(msg);
  } else if (msg.text == '/spam' && msg.from.id == 91990226) {
    spam(msg, '*Hi from bifot spam!*');
  } 

  // <--- Отладка

  else if (msg.text == '/res') {
    mongoose.connect(urlDb);

    var usersSchema = mongoose.Schema({
      id: Number,
      hash: {
        type: String,
        unique: true
      }
    });

    var Users = mongoose.model('users', usersSchema);

    Users.find({ id: msg.from.id }, (err, results) => {
      console.log(results[0]);

      mongoose.connection.close();
    })
  }












  else if (msg.text == '/del') {
    MongoClient.connect(urlDb, (err, db) => {
      assert.equal(null, err);

      var usersSchema = mongoose.Schema({
        id: Number,
        hash: String
      });

      var users = db.collection('users').remove();

      bot.sendMessage(msg.from.id, 'Deleted.');
    });
  }

  // Отладка -->

  else {
    parser(msg);
  }
});
