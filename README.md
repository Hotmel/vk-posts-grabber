# VK Posts Grabber

Ретрансляция постов из ВКонтакте в Telegram.

Проект находится в рабочем режиме и им можно пользоваться.

- **Telegram:** [@PostsGrabberBot](https://t.me/postsgrabberbot)
- **VK:** [https://vk.me/vkpostsgrabber](https://vk.me/vkpostsgrabber)

## Установка

```
$ git clone https://github.com/bifot/VKPostsGrabber
$ cd VKPostsGrabber
$ npm install
$ mongod --dbpath path-to-your-db
```

Далее вам нужно настроить бота для корректной работы, получив токены.

## Настройка

Чтобы полноценно использовать бота, вам понадобится два токена: Telegram Bot & VK Token.

- Telegram Token нужно получить у [@BotFather](https://t.me/botfather), создав нового бота или взяв токен уже существующего;
- VK Token нужно получить в настройках сообщества, подробнее можно прочитать в [официальной документации ВК](https://vk.com/dev/bizmessages_doc).

Токены нужно записать в файл **config.json**:

```javascript
{
  "telegram_token": "123124161:asASDAFweVAWEQFWEFsdY",
  "vk_token": "123ASDVA132g1dgsdfg123SDa12g31absdf1"
}
```

## Запуск

Запуск бота осуществляется командой:

```
$ npm start
```
_________
  
*Сделано с любовью, автор: [Михаил Семин](http://bifot.ru).*