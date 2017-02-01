const video = (attach, i) => {
  var type = attach.type; // Определяем тип
  var file = attach[type]; // Получаем объект файла

  if (type == 'video') {
    var link = `https://vk.com/video${file.owner_id}_${file.id}`;
    var video = `${file.title}: ${link}`;

    _message += `\n\n${video}`;
  }
};

module.exports = video;