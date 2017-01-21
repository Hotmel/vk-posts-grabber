const addText = require('../extra/addText')();
const isRepost = require('../extra/isRepost')();
const markDownLinks = require('../extra/markDownLinks')();
const crop = require('../extra/crop')();
const attachments = require('../attachments/attachments')();

var parser = (bot, request, config, petrovich) => {
  return (msg) => {
    // Если это ссылка на пост, работаем с ней,
    // если какое-то другое сообщение, говорим, что не понимаем    
    if (msg.text.search('vk.com') != -1 && msg.text.search('wall') != -1) {
      var url = msg.text;
      var linkToPost = url.split('&')[0]; // Отделяем от других аргументов
      var linkToPostSafe = linkToPost.substr(linkToPost.search('wall') + 4); // Обрезаем, чтоб оставались только owner & item ID

      // Делаем запрос к записи
      request(`https://api.vk.com/method/wall.getById?posts=${linkToPostSafe}&extended=1&access_token=${config.VKtoken}&v=5.60`, (error, response, body) => {
        var json = JSON.parse(body);

        if (!error && response.statusCode == 200 && json.response.items[0]) {
          var item = json.response.items[0];
          var text = item.text;
          var isRepost = item.copy_history;
          var profile = json.response.profiles[json.response.profiles.length - 1];
          var groups = json.response.groups[0];
          var linksToAttachments = {};
          var partOfText = [];

          global._message = '';

          // Добавляем текст и имена юзеров
          addText(profile, groups, text, isRepost, petrovich);

          // Исправляем вики-разметку
          markDownLinks();

          // Получаем приложения к посту
          attachments(item, isRepost, linksToAttachments);

          // Делим текст на куски, если message.length > 4096
          crop(partOfText);

          var sendPost = new Promise((resolve, reject) => {
            var settings = {
              parse_mode: 'HTML'
            };

            // Если сообщение маленькое, отправляем сразу полное,
            // если >4096 символов, то кусками
            if (_message) {
              bot.sendMessage(msg.from.id, _message, settings)
                .then(body => {
                  resolve('Отправили <4096 символов.');
                });
            } else if (partOfText) {
              var settings = {
                parse_mode: 'HTML'
              };

              partOfText.forEach(text => {
                bot.sendMessage(msg.from.id, text, settings);
              });

              resolve('SEND');
            }
          });

          sendPost
            .then(body => {
              Object.keys(linksToAttachments).forEach(attach => {
                if (attach.search('page') != -1) {
                  var settings = {
                    parse_mode: 'markdown'
                  };

                  bot.sendMessage(msg.from.id, `*Приложенная статья:*\n\n${linksToAttachments[attach]}`, settings);
                } else if (attach.search('photo') != -1) {
                  // Таймаут, чтоб фотография загружалась после приложения типа «Страница»
                  setTimeout(() => bot.sendPhoto(msg.from.id, linksToAttachments[attach]), 500);
                } else if (attach.search('doc') != -1) {
                  bot.sendDocument(msg.from.id, linksToAttachments[attach])
                }
              });
            });
        } else {
          bot.sendMessage(msg.from.id, 'Пост не найден.'); // Сделали запрос, пост не найден или произошла ошибка
        }
      });
    } else {
      bot.sendMessage(msg.from.id, 'Бот вас не понял.'); // Если пользователь ввел не ссылку
    }
  }
};

module.exports = parser;
