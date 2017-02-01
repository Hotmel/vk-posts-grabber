const rp = require('request-promise');
const config = require('../../config');

const sendMessage = (user_id, message) => {
  var options = {
    uri: `https://api.vk.com/method/messages.send?user_id=${user_id}&message=${encodeURIComponent(message)}&access_token=${config.vk_token}&v=5.62`,
    json: true
  };

  rp(options)
    .then(body => console.log(body))
    .catch(e => console.log(e));
};

module.exports = sendMessage;