var crop = (partOfText) => {
  // Если длина больше 4096, делим на части
  if (_message.length > 4096) {
    var parts = Math.ceil(_message.length / 4096); // Кол-во частей

    for (var i = 0; i < parts; i++) {
      partOfText.push(_message.substr(4096 * i, 4096)); // Пушим в массив кусок с макс. длиной 4096 символов
    }

    _message = null; // Обнуляем _message, для текста у нас теперь массив
  }
};

module.exports = crop;