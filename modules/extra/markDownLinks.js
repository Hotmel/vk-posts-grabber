var markdownLinks = () => {
  return () => {
    // Находим ссылки с ВК-разметкой
    var markdownLinks = _message.match(/\[([clubid]){0,}([0-9]){0,}\|.([\w\sа-яА-ЯёЁ.]){0,}.\S{0,}\]/g);

    // Заменяем ссылки в ВК-разметке
    if (markdownLinks) {
      markdownLinks.forEach(link => {
        var url = link.split('|')[0].substr(1);
        var title = link.split('|')[1].slice(0, -1);
        var linkToPage = `<a href="https://vk.com/${url}">${title}</a>`;

        _message = _message.replace(link, linkToPage);
      });
    }
  }
};

module.exports = markdownLinks;
