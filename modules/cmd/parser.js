module.exports = (bot, request) => {
  var module = {};

  module.cmd = (msg) => {
    // Если это ссылка на пост, работаем с ней,
    // если какое-то другое сообщение, говорим, что не понимаем    
    if (msg.text.search('vk.com') != -1 && msg.text.search('wall') != -1) {
      var url = msg.text;
      var linkToPost = url.split('&')[0]; // Отделяем от других аргументов
      var linkToPostSafe = linkToPost.substr(linkToPost.search('wall') + 4); // Обрезаем, чтоб оставались только owner & item ID

      // Делаем запрос к записи
      request(`https://api.vk.com/method/wall.getById?posts=${linkToPostSafe}&extended=1&v=5.60`, (error, response, body) => {
        var json = JSON.parse(body);

        if (!error && response.statusCode == 200 && json.response) {
          var group = json.response.groups[0];
          var groupName = group.name;
          var groupId = group.id;
          var item = json.response.items[0];
          var date = item.date;
          var isRepost = item.copy_history || 0;
          var linksToAttachmentsPhoto = [];
          var linksToAttachmentsLink = [];
          var linksToAttachments = [];
          var message;
          var bigMessage = [];

          try {
            var text = item.text || item.copy_history[0].text;
            var ownerPost = `ℹ️ пост из <a href="https://vk.com/club${groupId}">${groupName}</a>\n\n`;

            // Проверяем репост
            if (isRepost) {
              var profile = json.response.profiles[0];
              var userName = `${profile.first_name} ${profile.last_name}`;
              var userId = profile.id;
              var linkToUser = `<a href="https://vk.com/${userId}">${userName}</a>`;

              text = `↪️ ${linkToUser} репостул\n\n`;

              // Текст к репосту, если есть, то записываем
              if (item.text) {
                text += '_____\n\n';
                text += `Пользователь пишет: «${item.text}»`;
                text += '\n_____\n\n';
              }

              text += item.copy_history[0].text;
            }

            // Находим ссылки с ВК-разметкой
            var regexpMarkDownLinks = /\[([clubid]){0,}([0-9]){0,}\|([\w\sа-яА-ЯёЁ]){0,}\]/g;
            var markdownLinks = text.match(regexpMarkDownLinks);

            // Заменяем ссылки в ВК-разметке
            if (markdownLinks) {
              markdownLinks.forEach(link => {
                var href = link.split('|')[0].substr(1);
                var title = link.split('|')[1].slice(0, -1);
                var linkToPage = `<a href="https://vk.com/${href}">${title}</a>`;

                text = text.replace(link, linkToPage);
              });
            }

            text = ownerPost + text; // Добавляем ссылку на паблик

            // Если текст слишком большой, разделяем его
            if (text.length > 4096) {
              var parts = Math.ceil(text.length / 4096); // Количество частей
              var blocks = []; // Массив с длинами текстов

              for (var i = 0; i < parts; i++) {
                blocks.push(4096);
              }

              var lastSpace = 0;
              var beginString = 0;
              var endString = 0;

              blocks.forEach((block, i) => {
                endString += block;

                lastSpace = Math.max(
                  text.lastIndexOf(' ', endString),
                  text.lastIndexOf('.', endString),
                  text.lastIndexOf(',', endString)
                );

                bigMessage.push(text.substring(beginString, lastSpace));

                beginString = lastSpace + 1;
              });

              text = null; // Обнуляем, ибо текст у нас теперь в массиве bigMessage
            } else {
              message = text;
            }
          } catch (e) {
            console.log('Запись без текста.');
          }

          try {
            var attachments = item.attachments || item.copy_history[0].attachments;

            // Получаем приложения к посту
            attachments.forEach(attach => {
              var type = attach.type; // Определяем тип
              var file = attach[type]; // Получаем объект файла

              if (type == 'photo') {
                var photoVariation = [];

                Object.keys(file).forEach(key => {
                  if (key.search('photo') != -1) {
                    photoVariation.push(file[key]);
                  }
                });

                linksToAttachmentsPhoto.push(photoVariation[photoVariation.length - 1]); // Пушим самую большую фотку
              } else if (type == 'link') {
                message += `\n\n${file.url}`; // Добавляем в текст ссылку
              } else if (type == 'audio') {
                console.log('Аудиозаписи недоступны.');
              } else if (type == 'video') {
                var title = file.title;
                var link = `https://vk.com/video${file.owner_id}_${file.id}`;
                var video = `${title}: ${link}`;

                message += `\n\n${video}`;
              } else if (type == 'doc') {
                var url = file.url.split('?')[0];
                linksToAttachments.push(file.url); // Пушим остальные документы
              }
            });
          } catch (e) {
            console.log('Приложений нет.');
          }

          // Если текст маленький, отправляем его сразу,
          // а если большой, отправляем несколькими сообщениями цкилом
          if (message) {
            var settings = {
              parse_mode: 'HTML'
            };

            bot.sendMessage(msg.from.id, message, settings);
          } else if (bigMessage) {
            var settings = {
              parse_mode: 'HTML'
            };

            bigMessage.forEach(message => {
              bot.sendMessage(msg.from.id, message, settings);
            });
          }

          // Чуть позже отправляем приложения к посту
          setTimeout(() => {
            try {
              linksToAttachmentsPhoto.forEach(photo => {
                bot.sendPhoto(msg.from.id, photo);
              });
            } catch (e) {
              console.log('Ошибка при отправке фотографии.');
            }

            try {
              linksToAttachments.forEach(attach => {
                bot.sendDocument(msg.from.id, attach);
              });
            } catch (e) {
              console.log('Ошибка при отправке документа.');
            }
          }, 500);
        } else {
          bot.sendMessage(msg.from.id, 'Пост не найден.'); // Сделали запрос, пост не найден или произошла ошибка
        }
      });
    } else {
      bot.sendMessage(msg.from.id, 'Бот вас не понял.'); // Если пользователь ввел не ссылку
    }
  };

  return module;
};
