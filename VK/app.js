const rp = require('request-promise');
const md5 = require('md5');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const config = require('../config');

const telegramToken = config.token;
const vkToken = config.VKtoken;
const urlDb = config.urlDb;

const parser = require('../modules/cmd/parser')();

const random = (min, max) => {
  return Math.random() * (max - min) + min;
};

const sendMessage = (userID, message) => {
  var options = {
    uri: `https://api.vk.com/method/messages.send?user_id=${userID}&message=${encodeURIComponent(message)}&access_token=${vkToken}&v=5.62`,
    json: true
  };

  rp(options)
    .then(body => {
      if (body.response) {
        console.log(`Сообщение #${body.response} успешно отправлено.`);
      } else {
        console.log('Ошибка.');
      }
    })
    .catch(e => {
      console.log(e);
    })
};

const hash = md5(String(new Date().getTime()) + String(random(1111111111111, 99999999999999)));

const getPool = () => {
  var options = {
    uri: `https://api.vk.com/method/messages.getLongPollServer?need_pts=1&access_token=${vkToken}&v=5.62`,
    json: true
  };

  rp(options)
    .then(body => {
      var server = body.response.server;
      var key = body.response.key;
      var ts = body.response.ts;

      var options = {
        uri: `https://${server}?act=a_check&key=${key}&ts=${ts}&wait=25&mode=2&version=1`,
        json: true
      };

      rp(options)
        .then(body => {
          var updates = body.updates;

          var getUpdates = new Promise((resolve, reject) => {
            if (updates.length > 1) {
              resolve(updates);
            } else {
              reject('Nothing new...');
            }
          });

          getUpdates
            .then(body => {
              var user = body[0][3];
              var message = body[0][6];

              if (message == 'Старт') {
                sendMessage(
                  user,
                  'Привет, ты запустил бота для рентрансляции постов из ВК в Телеграм!\n\n' +
                  `Ваша уникальная ссылка для авторизации в бота телеграм: t.me/postsgrabberbot?start=${hash}`
                );
              } else if (message = 'Помощь') {
                sendMessage(
                  user,
                  'Это бот для рентрансляции постов из ВК в телеграм. Для начала работы вам нужно авторизоваться в боте для телеграм. Наберите /start, чтобы получить ссылку.'
                );
              }
            })
            .catch(e => {
              console.log(e);
            })

          getPool();

          // if (updates.length > 1) {
          //   var user = updates[0][3];
          //   var message = updates[0][6];

          //   if (message == 'Старт') {
          //     sendMessage(
          //       user,
          //       'Привет, ты запустил бота для рентрансляции постов из ВК в Телеграм!\n\n' +
          //       `Ваша уникальная ссылка для авторизации в бота телеграм: t.me/postsgrabberbot?start=${hash}`
          //     );
          //   } else if (message = 'Помощь') {
          //     sendMessage(
          //       user,
          //       'Это бот для рентрансляции постов из ВК в телеграм. Для начала работы вам нужно авторизоваться в боте для телеграм. Наберите /start, чтобы получить ссылку.'
          //     );
          //   }
          // }
        })
        .catch(e => {
          console.log(e);
        })
    })
    .catch(e => {
      console.log(e);
    });

  // request(`https://api.vk.com/method/messages.getLongPollServer?need_pts=1&access_token=${vkToken}&v=5.62`, (error, response, body) => {
  //   if (!error && response.statusCode == 200) {
  //     var json = JSON.parse(body);
  //     var server = json.response.server;
  //     var key = json.response.key;
  //     var ts = json.response.ts;
  //     var pts = json.response.pts;

  //     request(`https://${server}?act=a_check&key=${key}&ts=${ts}&wait=25&mode=2&version=1`, (error, response, body) => {
  //       if (!error && response.statusCode == 200) {
  //         var json = JSON.parse(body);
  //         var updates = json.updates;



  //         if (updates.length) {
  //           var user = updates[0][3];
  //           var message = updates[0][6];

  //           if (message == 'Старт') {
  //             sendMessage(
  //               user,
  //               'Привет, ты запустил бота для рентрансляции постов из ВК в Телеграм!\n\n' +
  //               `Ваша уникальная ссылка для авторизации в бота телеграм: t.me/postsgrabberbot?start=${hash}`
  //             );
  //           } else if (message = 'Помощь') {
  //             sendMessage(
  //               user,
  //               'Это бот для рентрансляции постов из ВК в телеграм. Для начала работы вам нужно авторизоваться в боте для телеграм. Наберите /start, чтобы получить ссылку.'
  //             );
  //           } else {
  //             MongoClient.connect(urlDb, (err, db) => {
  //               console.log(err);

  //               var users = db.collection('users');

  //               users.find({ hash: hash }).toArray((err, results) => {
  //                 if (results[0]) {
  //                   var telegramUserId = results[0].id;

  //                   sendMessage(
  //                     user,
  //                     'Пост обработан и отправлен в телеграм.'
  //                   );
  //                 } else {
  //                   sendMessage(
  //                     user,
  //                     'Извините, но вы не найдены в базе данных у бота. Наберите /start для получения уникального хэш-кода и авторизуйтесь у бота в телеграм.'
  //                   );
  //                 }
  //               });
  //             })
  //           }
  //         }

  //         getPool();
  //       }
  //     });
  //   } else {
  //     console.log(error);
  //   }
  // });
};

getPool();
