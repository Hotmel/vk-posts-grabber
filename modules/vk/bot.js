const rp = require('request-promise');
const mongoose = require('mongoose');
const md5 = require('md5');
const config = require('../../config');
const Users = require('../db/users_model');
const random = require('../commons/random');
const sendMessage = require('./sendMessage');
const parser = require('../cmd/parser');

const hash = md5(String(new Date().getTime()) + String(random(1111111111111, 99999999999999)));

var longPollParams = {};

const getLongPollParams = () => {
  var options = {
    uri: `https://api.vk.com/method/messages.getLongPollServer?need_pts=1&access_token=${config.vk_token}&v=5.62`,
    json: true
  };

  rp(options)
    .then(body => {
      longPollParams = body.response;

      startLongPoll();
    })
    .catch(e => console.log(e));
};

const startLongPoll = () => {
  var options = {
    uri: `https://${longPollParams.server}?act=a_check&key=${longPollParams.key}&ts=${longPollParams.ts}&wait=25&mode=2&version=1`,
    json: true
  };

  rp(options)
    .then(body => {
      if (body.ts) {
        longPollParams.ts = body.ts;
      } else {
        getLongPollParams();
        return;
      }

      var updates = body.updates;

      if (!updates || updates.length == 0) {
        startLongPoll();
        return;
      }

      for (var i = 0, l = updates.length - 1; i <= l; i++) {
        var update = updates[i];

        if (update[0] != 4) { // 0 элемент == тип события. Для сообщений это 4
          continue;
        }

        var flags = update[2]; // 2 элемент == флаги события.

        // Проверяем есть ли во флагах значние 2 (OUTBOX == исходящее сообщение),
        // если сообщение исходящее, игнорируем его. Нам нужны только входящие

        if ((flags & 2) != 0) {
          continue;
        }

        var user_id = update[3];
        var message = update[6].toLowerCase();
        var post = update[7].attach1;

        if (message ==  '/start') {
          sendMessage(user_id, 'Привет, вы запустили бота для ретрансляции постов из ВК в телеграм!\n\n' +
                               `Ваша уникальная ссылка для авторизации в бота телеграм: t.me/postsgrabberbot?start=${hash}_user_id=${user_id}`);
        } else if (message == '/help') {
          sendMessage(user_id, 'Это бот для ретрансляции постов из ВК в телеграм. Для начала работы вам нужно авторизоваться в боте для телеграм. Наберите /start, чтобы получить ссылку.');
        } else {
          mongoose.connect(config.url_database);

          Users.find({}, (err, results) => {
            if (results[0]) {
              parser(results[0].id, message, post);
              sendMessage(user_id, 'Отправлено в телеграм.');
            } else {
              sendMessage(user_id, 'Вы не авторизованы у бота. Наберите /start, чтобы получить дальнейшие указания.');
            }
          });
          
          mongoose.connection.close();
        }
      }

      startLongPoll();
    })
    .catch(e => console.log(e));
};

module.exports = getLongPollParams;