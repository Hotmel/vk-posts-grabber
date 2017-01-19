const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const config = require('./config');

const token = config.token;

const bot = new TelegramBot(token, { polling: true });

const start = require('./modules/cmd/start')(bot);
const help = require('./modules/cmd/help')(bot);
const parser = require('./modules/cmd/parser')(bot, request);

bot.on('message', msg => {
  console.log(`Пользователь @${msg.from.username} написал «${msg.text}»`);

  if (msg.text == '/start') {
    start.cmd(msg);
  } else if (msg.text == '/help') {
    help.cmd(msg);
  } else {
    parser.cmd(msg);
  }
});