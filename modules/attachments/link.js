const link = (attach) => {
  var type = attach.type; // Определяем тип
  var file = attach[type]; // Получаем объект файла

  if (type == 'link') {
    var link = file.url;
    var linkWithoutUTM = link.split('?')[0];

    if (_message.search(linkWithoutUTM) == -1) {
      _message += `\n\n${file.url}`; // Добавляем в текст ссылку, если она еще не прикреплена
    }
  }
};

module.exports = link;