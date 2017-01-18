module.exports = (bot) => {
  var module = {};

  module.cmd = (msg) => {
    var settings = {
      parse_mode: 'markdown'
    };

    bot.sendMessage(msg.from.id, `Привет, ${msg.chat.username}!\n\n` +
                                 'Это бот для репоста постов из ВКонакте в Telegram.\n\n' +
                                 'Например, вы даете боту ссылку такого типа: [https://vk.com/feed?w=wall-29534144_5332642](https://vk.com/feed?w=wall-29534144_5332642), а он в ответ вам высылает содержимое этого поста.\n\n' +
                                 'Все последующие сообщения (без использования команд) будут рассматриваться как ссылки, если в тексте сообщения есть *vk.com* и идентификатор *wall*', settings);
  };

  return module;
};