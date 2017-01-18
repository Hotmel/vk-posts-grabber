module.exports = (bot, request) => {
  var module = {};

  module.cmd = (msg) => {
    // Если это ссылка на пост, работаем с ней
    // если какое-то другое сообщение, говорим, что не понимаем.

    if (msg.text.search('vk.com') != -1 && msg.text.search('wall') != -1) {
      var url = msg.text;
      var linkToPost = url.split('&')[0]; // Отделяем от других аргументов
      var linkToPostSafe = linkToPost.substr(linkToPost.search('wall') + 4); // Обрезаем, чтоб оставались только owner & item ID

      // Делаем запрос к записи
      var res = request('GET', `https://api.vk.com/method/wall.getById?posts=${linkToPostSafe}&extended=1&v=5.60`);
      var body = JSON.parse(res.getBody());

      // var regexp = /[\[|\]a-z-0-9]{0,90}/i; // Регулярка для ссылок на паблики/пользователя

      var item = body.response.items[0];
      var date = item.date;
      var text = item.text || 'Запись без текста.';
      var isRepost = item.copy_history || 0;
      var attachments = item.attachments || item.copy_history[0].attachments;
      var linksToAttachmentsPhoto = [];
      var linksToAttachmentsLink = [];
      var linksToAttachments = [];

      if (isRepost) {
        text = '↪️ репост\n\n';
        
        // Текст к репосту, если есть, то записываем
        if (item.text) {
          text += '_____\n\n';
          text += `Пользователь пишет: «${item.text}»`;
          text += '\n_____\n\n'; 
        }       
        text += item.copy_history[0].text;
      }

      console.log(text);

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
          text += `\n\n${file.url}`; // Добавляе в текст ссылку
        } else if (type == 'audio') {
          console.log('Аудиозаписи недоступны.');
        } else {
          linksToAttachments.push(file.url); // Пушим остальные документы
        }
      });     

      bot.sendMessage(msg.from.id, text);

      setTimeout(() => {
        if (linksToAttachmentsPhoto) {
          linksToAttachmentsPhoto.forEach(photo => {
            bot.sendPhoto(msg.from.id, photo);
          });
        } else {
          linksToAttachments.forEach(attach => {
            bot.sendDocument(msg.from.id, attach)
          });
        }
      }, 500);
    } else {
      bot.sendMessage(msg.from.id, 'Бот вас не понял.');
    }
  };

  return module;
};