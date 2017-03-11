import { Extra, Markdown } from 'Telegraf';
import '../db/base.js';

module.exports = ctx => {
  var message = '<b>Привет!</b>\n\nЭто бот для ретрансляции постов из ВКонакте в Telegram.\n\nНапример, вы даете боту ссылку такого типа: https://vk.com/feed?w=wall-29534144_5332642, а он в ответ вам высылает содержимое этого поста.\n\nВсе последующие сообщения (без использования команд) будут рассматриваться как ссылки, если в тексте сообщения есть <b>vk.com</b> и идентификатор <b>wall</b>.\n\nЕсли нужна помощь, наберите /help.';

  if (ctx.message.text.split('?hash=')[1]) {
    var hash = ctx.message.text.split('?hash=')[1].split('&uid=')[0];
    var uid = ctx.message.text.split('&uid=')[1];

    var data = {
      tgId: ctx.from.id,
      vkId: uid,
      hash: hash
    };

    db.users.find({ tgId: ctx.from.id }).then(response => {
      if (response[0]) {
        db.users.update({ tgId: ctx.from.id }, data).then(console.log).catch(console.log);

        console.log('Need update!');
      } else {
        db.users(data).save().catch(console.log);
      }
    });
  } else {
    var data = {
      tgId: ctx.from.id
    };

    db.users.find(data).then(response => {
      if (!response[0]) {
        db.users(data).save().catch(console.log);
      }
    });

    message += '\n\n<b>Внимание! Для использования бота в связке ВКонтакте и Телеграм нужно авторизоваться в боте. Просто напишите</b> <a href="http://bifot.ru">боту ВКонтакте</a><b>.</b>';
  }

  ctx.reply(message, Extra.HTML());
};
