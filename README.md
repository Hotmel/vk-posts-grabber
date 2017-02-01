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
$ node app.js
```

## Настройка

Чтобы полноценно использовать бота, вам понадобится два токена: Telegram Bot & VK Token.

- Получить Telegram TOKEN легко, достаточно создать бота, обратившись к [@BotFather](https://t.me/botfather);
- VK Token можно получить в настройках сообщества.

**Пример токена:** b4f62ec4e26098a4efd157a155b01230cc466355277d48df2317b0597d43fa36fb0b694bc50f6496a516c.

Токены нужно записать в файл **config.json**:

```javascript
{
  "telegram_token": "123124161:asASDAFweVAWEQFWEFsdY",
  "vk_token": "123ASDVA132g1dgsdfg123SDa12g31absdf1"
}
```
_________
  
*Сделано с любовью, автор: [Михаил Семин](http://bifot.ru).*