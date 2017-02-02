const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const start = require('./modules/cmd/start');
const help = require('./modules/cmd/help');
const parser = require('./modules/cmd/parser');
const vkbot = require('./modules/vk/bot');

const bot = new TelegramBot(config.telegram_token, { polling: true });

vkbot();

bot.on('message', msg => {
  console.log(`Пользователь @${msg.from.username} написал «${msg.text}»`);

  if (msg.text.match('/start')) {
    start(msg);
  } else if (msg.text == '/help') {
    help(msg);
  } else {
    parser(null, msg);
  }
});