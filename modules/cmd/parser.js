const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const mongoose = require('mongoose');
const petrovich = require('petrovich');
const config = require('../../config');
const addText = require('../extra/addText');
const isRepost = require('../extra/isRepost');
const markDownLinks = require('../extra/markDownLinks');
const crop = require('../extra/crop');
const attachments = require('../attachments/attachments');
const sendMessage = require('../vk/sendMessage');

const bot = new TelegramBot(config.telegram_token, { polling: false });

var parser = (id, msg, attach, user_vk) => {
  var originalMessage = msg || msg.text || 'https://vk.com/wall-138512400_5';
  var userID = id || msg.from.id;

  // Если это ссылка на пост, работаем с ней,
  // если какое-то другое сообщение, говорим, что не понимаем    
  if (attach || originalMessage.search('vk.com') != -1 && originalMessage.search('wall') != -1) {
    var linkToPost = attach || originalMessage.split('wall')[1].split('%')[0];

    // Делаем запрос к записи
    request(`https://api.vk.com/method/wall.getById?posts=${linkToPost}&extended=1&v=5.60`, (error, response, body) => {
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
            bot.sendMessage(userID, _message, settings)
              .then(body => {
                resolve('Отправили <4096 символов.');
              });
          } else if (partOfText) {
            var settings = {
              parse_mode: 'HTML'
            };

            partOfText.forEach(text => {
              bot.sendMessage(userID, text, settings);
            });

            resolve('Отправлено сообщение по частям.');
          }

          sendMessage(user_vk, 'Пост отправлен.');
        });

        sendPost.then(body => {
          Object.keys(linksToAttachments).forEach(attach => {
            if (attach.search('page') != -1) {
              var settings = {
                parse_mode: 'markdown'
              };

              bot.sendMessage(userID, `*Приложенная статья:*\n\n${linksToAttachments[attach]}`, settings);
            } else if (attach.search('photo') != -1) {
              // Таймаут, чтоб фотография загружалась после приложения типа «Страница»
              setTimeout(() => bot.sendPhoto(userID, linksToAttachments[attach]), 500);
            } else if (attach.search('doc') != -1) {
              bot.sendDocument(userID, linksToAttachments[attach])
            }
          });
        });
      } else {
        var err = 'Пост не найден.';

        bot.sendMessage(userID, err); // Сделали запрос, пост не найден или произошла ошибка
        sendMessage(user_vk, err); // Для ВК
      }
    });
  } else {
    var err = 'Бот вас не понял. Вероятно, вы не ввели ссылку или не прикрепили пост.';

    bot.sendMessage(userID, err); // Если пользователь не ввел ссылку
    sendMessage(user_vk, err); // Для В
  }
};

module.exports = parser;