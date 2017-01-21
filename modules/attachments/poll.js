var Poll = () => {
  return (attach) => {
    var type = attach.type; // Определяем тип
    var file = attach[type]; // Получаем объект файла

    if (type == 'poll') {
      var question = file.question;
      var answers = file.answers;

      _message += '\n\n<b>Опрос:</b>\n\n';
      _message += `${question}\n`;

      answers.forEach(answer => {
        var text = answer.text;
        var votes = answer.votes;
        var rate = answer.rate;

        _message += `\n<b>${text}</b> / ${votes} / ${rate} %`;
      });
    }
  }
};

module.exports = Poll;
