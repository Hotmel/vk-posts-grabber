import request from 'request';

module.exports = (uid, msg, token) => {
  request({
    uri: `https://api.vk.com/method/messages.send?user_id=${uid}&message=${encodeURIComponent(msg)}&access_token=${token}`,
    json: true
  }, (body, response, err) => {
    if (!err && response.statusCode == 200) {
      res.send('Message sent.');
    }
  });
};
