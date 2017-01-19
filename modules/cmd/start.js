module.exports = (bot) => {
  var module = {};

  module.cmd = (msg) => {
    var settings = {
      parse_mode: 'HTML'
    };

    bot.sendMessage(msg.from.id, `<b>Привет, ${msg.chat.username}!</b>\n\n` +
                                 'Это бот для репоста постов из ВКонакте в Telegram.\n\n' +
                                 'Например, вы даете боту ссылку такого типа: https://vk.com/feed?w=wall-29534144_5332642, а он в ответ вам высылает содержимое этого поста.\n\n' +
                                 'Все последующие сообщения (без использования команд) будут рассматриваться как ссылки, если в тексте сообщения есть <b>vk.com</b> и идентификатор <b>wall</b>.\n\n' +
                                 'Наберите /help для справки.', settings);
  };

  return module;
};