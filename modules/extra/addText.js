var addText = (profile, groups, text, isRepost, petrovich) => {
  // Смотрим автора поста
  if (profile) {
    var gender = 1 ? 'female' : 'male';

    var person = {
      gender: gender,
      first: profile.first_name,
      last: profile.last_name
    };

    var name = `${petrovich(person, 'genitive').first} ${petrovich(person, 'genitive').last}`;
    var userId = profile.id;
    var linkToUser = `<a href="https://vk.com/${userId}">${name}</a>`;
    var spaces = (text) ? '\n\n' : ''; // Добавляем отступы после текста, если он есть

    if (isRepost) {
      _message += `ℹ️ репост со стены ${linkToUser}`;
      _message += `${spaces}${text}\n___\n\n`;
      _message += isRepost[0].text;
    } else {
      _message += `ℹ️ пост со стены ${linkToUser}`;
      _message += `${spaces}${text}`;
    }
  } else if (groups) {
    var ownerPost = `ℹ️ пост из <a href="https://vk.com/club${groups.id}">${groups.name}</a>`;
    var spaces = (text) ? '\n\n' : ''; // Добавляем отступы после текста, если он есть

    _message += ownerPost;

    if (isRepost) {
      _message += `${spaces}${isRepost[0].text}`;
    } else {
      _message += `${spaces}${text}`;
    }
  }
};

module.exports = addText;