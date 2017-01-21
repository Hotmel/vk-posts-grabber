var Page = () => {
  return (attach, config, request, linksToAttachments, i) => {
    var type = attach.type; // Определяем тип
    var file = attach[type]; // Получаем объект файла

    if (type == 'page') {
      var id = file.id;
      var groupId = `-${file.group_id}`;

      request(`https://api.vk.com/method/pages.get?owner_id=${groupId}&page_id=${id}&need_html=1&access_token=${config.VKtoken}`, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          var json = JSON.parse(body);
          var regexp = /(\<(\/?[^>]+)>)/g;
          var dirtyHTML = json.response.html;
              dirtyHTML = dirtyHTML.replace(/<br\/><br\/>/g, '\n');
          var cleanHTML = dirtyHTML.replace(regexp, '');

          linksToAttachments[`page${i}`] = cleanHTML;
        } else {
          console.log('Ошибка при запросе к приложению типа «Страница».');
        }
      });
    }
  }
};

module.exports = Page;
