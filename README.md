# VK Posts Grabber

Ретрансляция постов из ВКонтакте в Telegram. Теперь заходить в ВК вовсе не обязательно, все в любимом телеграме!

Бот находится в рабочем режиме и им можно пользоваться. **Логин бота: @PostsGrabberBot**

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
- VK Token можно получить через [авторизацию](https://vk.cc/5ZaXHu) в приложении. Разрешаете доступ, потом в адресной строке ищем токен. Все, что идет от **#access_token=** до **&expires_in** является токеном.

**Пример токена:** b4f62ec4e26098a4efd157a155b01230cc466355277d48df2317b0597d43fa36fb0b694bc50f6496a516c.

Токены нужно записать в файл **config.json**:

```javascript
{
  "token": "123124161:asASDAFweVAWEQFWEFsdY",
  "VKtoken": "123ASDVA132g1dgsdfg123SDa12g31absdf1"
}
```
_________
  
*Сделано с любовью, автор: [Михаил Семин](http://bifot.ru).*