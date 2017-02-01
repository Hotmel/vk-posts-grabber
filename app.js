const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const start = require('./modules/cmd/start');
const help = require('./modules/cmd/help');
const parser = require('./modules/cmd/parser');
const vkBOT = require('./modules/vk/bot');
const mongoose = require('mongoose');
const Users = require('./modules/db/users_model');

const bot = new TelegramBot(config.telegram_token, { polling: true });

vkBOT();

bot.on('message', msg => {
  console.log(`Пользователь @${msg.from.username} написал «${msg.text}»`);

  if (msg.text.match('/start')) {
    start(msg);
  } else if (msg.text == '/help') {
    help(msg);
  }

  // <--- Отладка
  else if (msg.text == '/res') {
    mongoose.connect(config.url_database);

    Users.find({}, (err, results) => {
      console.log(results);
    });
    
    mongoose.connection.close();
  } else if (msg.text == '/del') {
    mongoose.connect(config.url_database);

    Users.collection.drop((err, results) => {
      if (err) {
        bot.sendMessage(msg.from.id, 'Error');
      } else {
        bot.sendMessage(msg.from.id, 'Deleted');
      }
    });

    mongoose.connection.close();
  }

  // Отладка -->
  else {
    parser(null, msg);
  }
});
