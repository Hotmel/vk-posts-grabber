var Doc = () => {
  return (attach, linksToAttachments, i) => {
    var type = attach.type; // Определяем тип
    var file = attach[type]; // Получаем объект файла

    if (type == 'doc') {
      linksToAttachments[`doc${i}`] = file.url;
    }
  }
};

module.exports = Doc;
