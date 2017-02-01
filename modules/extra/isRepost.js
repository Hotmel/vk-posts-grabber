var isRepost = (isRepost, json, item, text) => {
  if (isRepost) {
    var profile = json.response.profiles[0];
    var group = json.response.groups[0];
    var groupName = group.name;
    var groupId = group.id;

    ownerPost = `ℹ️ пост из <a href="https://vk.com/club${groupId}">${groupName}</a>\n\n`;

    // Смотрим, кто сделал репост: пользователь или сообщество
    if (profile) {
      var userName = `${profile.first_name} ${profile.last_name}`;
      var userId = profile.id;
      var linkToUser = `<a href="https://vk.com/${userId}">${userName}</a>`;

      text = `↪️ ${linkToUser} репостул\n\n`;

      // Текст к репосту, если есть, то записываем
      if (item.text) {
        text += `${item.text}`;
        text += '\n_____\n';
      }

      text += isRepost.text;
    } else if (group) {
      text = `↪️ сообщество репостуло (реклама)\n\n`;

      // Текст к репосту, если есть, то записываем
      if (item.text) {
        text += `${item.text}`;
        text += '\n_____\n';
      }

      text += isRepost.text;
    }
  }
};

module.exports = isRepost;