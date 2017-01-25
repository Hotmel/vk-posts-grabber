const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const config = require('../../config');

const telegramToken = config.token;
const urlDb = config.urlDb;

const bot = new TelegramBot(telegramToken, { polling: false });

var Spam = () => {
  return (msg, messageSpam) => {
    MongoClient.connect(urlDb, (err, db) => {
      assert.equal(null, err);

      var users = db.collection('users');
      
      users.find().toArray((err, results) => {
        Object.keys(results).forEach(key => {
          if (results[key]) {
            Object.keys(results[key]).forEach((id, i) => {
              // Берем только первый ID (userID пользователя)
              if (i == 0) {
                var settings = {
                  parse_mode: 'markdown'
                };

                bot.sendMessage(id, messageSpam, settings);
              }
            });
          }
        });
      });
    });
  }
};

module.exports = Spam;