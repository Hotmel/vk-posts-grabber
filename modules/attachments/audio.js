var Audio = () => {
  return (attach) => {
    var type = attach.type; // Определяем тип
    var file = attach[type]; // Получаем объект файла

    if (type == 'audio') {
      _message += '\n\n<i>К посту прикреплена аудиозапись, но политика ВК не позволяет ее прикрепить.</i>';
    }
  }
};

module.exports = Audio;
