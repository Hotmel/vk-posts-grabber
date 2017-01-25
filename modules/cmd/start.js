const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const mongoose = require('mongoose');
const config = require('../../config');

const telegramToken = config.token;
const urlDb = config.urlDb;

const bot = new TelegramBot(telegramToken, { polling: false });

var Start = () => {
  return (msg) => {
    var hash = msg.text.split(' ')[1];
    var hashRegexp = /[a-z-0-9]{32}/g;

    var settings = {
      parse_mode: 'HTML'
    };

    var message = `<b>Привет, ${msg.from.first_name}!</b>\n\n` +
                  'Это бот для репоста постов из ВКонакте в Telegram.\n\n' +
                  'Например, вы даете боту ссылку такого типа: https://vk.com/feed?w=wall-29534144_5332642, а он в ответ вам высылает содержимое этого поста.\n\n' +
                  'Все последующие сообщения (без использования команд) будут рассматриваться как ссылки, если в тексте сообщения есть <b>vk.com</b> и идентификатор <b>wall</b>.\n\n' +
                  'Наберите /help для справки.';

    if (hash && hashRegexp.test(hash)) {
      mongoose.connect(urlDb);

      var usersSchema = mongoose.Schema({
        id: Number,
        hash: {
          type: String,
          unique: true
        }
      });

      var Users = mongoose.model('users', usersSchema);
      var hash = new Users({ id: msg.from.id, hash: hash });

      console.log(hash);

      mongoose.connection.close();

      // MongoClient.connect(urlDb, (err, db) => {
      //   assert.equal(null, err);

      //   var ids = db.collection('ids');
      //   var id = {};
      //       id[msg.from.id] = msg.from.username;

      //   var users = db.collection('users');
      //   var user = {};
      //       user.id = msg.from.id;
      //       user.hash = hash;

      //   users.insert(user, { unique: true }, (err, results) => {
      //     if (!err && results.result.ok) {
      //       console.log('Пользователь (id & hash) успешно записан.');
      //     } else {
      //       users.update({ id: msg.from.id }, { $set: { hash: hash } }, { upsert: true}, (err, results) => {
      //         console.log('Перезаписали.')
      //       });
      //     }
      //   });
      // });
    } else {
      // MongoClient.connect(urlDb, (err, db) => {
      //   assert.equal(null, err);

      //   var ids = db.collection('ids');
      //   var id = {};
      //       id.id = msg.from.id;

      //   ids.insert(id, { unique: true }, (err, results) => {
      //     if (!err && results.result.ok) {
      //       console.log('Пользователь (only id) успешно записан.');
      //     } else {
      //       console.log(err);
      //     }
      //   });
      // });

      message += '\n\n<b>Внимание! Для работы в связке ВК-Телеграм необходимо авторизоваться в боте, используя хэш. Получить его можно у бота по</b> <a href="https://vk.com/id383224823">ссылке</a><b>, написав ему «Старт».</b>';
    }


    bot.sendMessage(msg.from.id, message, settings);
  }
};

module.exports = Start;