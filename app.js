import Telegraf from 'telegraf';
import request from 'request';
import express from 'express';
import bodyParser from 'body-parser';
import md5 from 'md5';
import config from './config';
import start from './modules/cmd/start';
import help from './modules/cmd/help';
import repeater from './modules/cmd/repeater';
import random from './modules/commons/random';
import sendMessage from './modules/commons/sendMessage';
import './modules/db/base';

/*

  Telegram LongPool

*/

const bot = new Telegraf(config.telegram_token);

bot.command('start', start);
bot.command('help', help);

bot.on('message', ctx => {
  repeater(ctx);
});

bot.startPolling();

/*

  VK Callback API

*/

const app = express();
const port = process.env.PORT || 3000;

const getLastMessage = msg => {
  if (msg.fwd_messages && msg.fwd_messages.length) {
    return getLastMessage(msg.fwd_messages[0]);
  }

  return msg;
};

app.use(bodyParser.json());

app.all('/', (req, res) => {
  switch (req.body.type) {
    case 'confirmation':
      res.send(config.confirmation_code);
      break;

    case 'message_new':
      var data = req.body.object;
      var uid = data.user_id;
      var msg;

      if (data.body) {
        msg = data.body.toLowerCase();
      } else if (getLastMSG(data)) {
        if (getLastMSG(data).attachments && getLastMSG(data).attachments[0].type == 'link') {
          msg = getLastMSG(data).attachments[0].link.url;
        } else {
          msg = getLastMSG(data).body.toLowerCase();
        }
      } else if (data.attachments && data.attachments[0].type == 'link') {
        msg = data.attachments[0].link.url;
      }

      if (msg == '/start') {
        db.users.find({ vkId: uid }).then(response => {
          if (response[0]) {
            sendMessage(uid, 'Вы уже авторизованы.');
          } else {
            const hash = md5(String(new Date().getTime()) + String(random(1111111111111, 99999999999999)));

            sendMessage(uid, `Привет, вы запустили бота для ретрансляции постов из ВК в телеграм!\n\nВаша уникальная ссылка для авторизации в телеграм: t.me/postsgrabberbot?start=?hash=${hash}?uid=${uid}`);
          }
        });
      } else {
        db.users.find({ vkId: uid }).then(response => {
          if (response[0]) {
            repeater(null, uid, msg);
          } else {
            sendMessage(uid, 'Вы не авторизованы у бота. Наберите /start, чтобы получить дальнейшие указания.');
          }
        });
      }

      break;

    /*

      Later I must add group_join and group_leave events...

    */
  }

  res.end('ok');
});

app.listen(port);
