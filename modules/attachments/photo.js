const photo = (attach, linksToAttachments, i) => {
  var type = attach.type; // Определяем тип
  var file = attach[type]; // Получаем объект файла

  if (type == 'photo') {
    var photoVariation = [];

    Object.keys(file).forEach(key => {
      if (key.search('photo') != -1) {
        photoVariation.push(file[key]);
      }
    });

    linksToAttachments[`photo${i}`] = photoVariation[photoVariation.length - 1];
  }
};

module.exports = photo;