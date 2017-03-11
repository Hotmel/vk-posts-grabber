import { Extra, Markdown } from 'Telegraf';
import request from 'request';
import petrovich from 'petrovich';
import each from 'promise-each';
import config from '../../config';

module.exports = (ctx, user, post) => {
  var originalMsg = ctx.message.text;
  var uid = user || ctx.from.id;

  if (post || originalMsg.search('vk.com') != -1 && originalMsg.search('wall') != -1) {
    var postId = (post || originalMsg).split('wall')[1].split('%')[0];

    request({
        url: `https://api.vk.com/method/wall.getById?posts=${postId}&extended=1&access_token=${config.vk_token}&v=5.60`,
        json: true
      }, (error, response, body) => {
        if (!error && response.statusCode == 200 && body.response) {
          var item = body.response.items[0];
          var text = item.text;
          var isRepost = item.copy_history;
          var attachments = item.attachments || isRepost && isRepost[0].attachments;
          var profile = body.response.profiles[body.response.profiles.length - 1];
          var groups = body.response.groups[0];

          var attach = [];
          var partOfText = [];
          var post;

          if (profile) {
            var gender = 1 ? 'male' : 'female';

            var person = {
              gender: gender,
              first: profile.first_name,
              last: profile.last_name
            };

            var userName = `${petrovich(person, 'genitive').first} ${petrovich(person, 'genitive').last}`;
            var userId = profile.id;
            var userUrl = `<a href="https://vk.com/${userId}">${userName}</a>`;
            var spaces = text ? '\n\n' : ''; // Добавляем отступы после текста, если он есть

            if (isRepost) {
              post = `ℹ️ репост со стены ${userUrl}`;
              post += `${spaces}${text}\n___\n\n`;
              post += isRepost[0].text;
            } else {
              post = `ℹ️ пост со стены ${userUrl}`;
              post += `${spaces}${text}`;
            }
          } else if (groups) {
            var postOwner = `ℹ️ пост из <a href="https://vk.com/club${groups.id}">${groups.name}</a>`;
            var spaces = text ? '\n\n' : ''; // Добавляем отступы после текста, если он есть

            post = postOwner;

            if (isRepost) {
              post += `${spaces}${isRepost[0].text}`;
            } else {
              post += `${spaces}${text}`;
            }
          }

          var markdownUrl = post.match(/\[([clubid]){0,}([0-9]){0,}\|.([\w\sа-яА-ЯёЁ.]){0,}.\S{0,}\]/g);

          if (markdownUrl) {
            markdownUrl.forEach(url => {
              post = post.replace(url, `<a href="https://vk.com/${url.split('|')[0].substr(1)}">${url.split('|')[1].slice(0, -1)}</a>`);
            });
          }

          if (attachments) {
            attachments.forEach(attachment => {
              switch (attachment.type) {
                case 'photo':
                  var file = attachment.photo;
                  var photos = [];

                  Object.keys(file).forEach(key => {
                    if (key.search('photo') != -1) {
                      photos.push(file[key]);
                    }
                  });

                  attach.push({
                    'type': 'photo',
                    'content': photos[photos.length - 1]
                  });

                  break;

                case 'link':
                  var url = attachment.link.url;

                  if (post.search(url.split('?')[0]) == -1) {
                    post += `\n\n${url}`;
                  }

                  break;

                case 'video':
                  var file = attachment.video;
                  var url = `https://vk.com/video${file.owner_id}_${file.id}`;
                  var video = `${file.title}: ${url}`;

                  post += `\n\n${video}`;
                  break;

                case 'audio':
                  var file = attachment.audio;

                  post += '\n\n<i>К посту прикреплена аудиозапись, но политика ВК не позволяет ее прикрепить.</i>';
                  break;

                case 'poll':
                  var file = attachment.poll;
                  var question = file.question;
                  var answers = file.answers;

                  post += '\n\n<b>Опрос:</b>\n\n';
                  post += `${question}\n`;

                  answers.forEach(answer => {
                    var text = answer.text;
                    var votes = answer.votes;
                    var rate = answer.rate;

                    post += `\n<b>${text}</b> / ${votes} / ${rate} %`;
                  });

                  break;

                case 'page':
                  var file = attachment.page;
                  var postId = file.id;
                  var groupId = `-${file.group_id}`;

                  request({
                    url: `https://api.vk.com/method/pages.get?owner_id=${groupId}&page_id=${id}&need_html=1&access_token=${config.vk_token}`,
                    json: true
                  }, (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                      var html = body.response.html.replace(/<br\/><br\/>/g, '\n').replace(/(\<(\/?[^>]+)>)/g, '');

                      attach.push({
                        'type': 'page',
                        'content': html
                      });
                    } else {
                      console.log('Ошибка при запросе к приложению типа «Страница».');
                    }
                  });

                  break;

                case 'doc':
                  var file = attachment.doc;

                  attach.push({
                    'type': 'doc',
                    'content': file.url
                  });

                  break;
              }
            });
          }

          if (post.length > 4096) {
            var sendTrimParts = new Promise((resolve, reject) => {
              var partsCount = Math.ceil(post.length / 4096);
              var parts = [];

              for (var i = 0; i < partsCount; i++) {
                parts.push({
                  'count': i,
                  'content': post.substr(4096 * i, 4096)
                });
              }

              resolve(parts);
            });

            sendTrimParts.then(parts => {
              var consistentParts = parts.sort((a, b) => {
                return parseFloat(a.count) - parseFloat(b.count);
              });

              Promise.resolve(consistentParts).then(each(part => {
                ctx.telegram.sendMessage(uid, part.content, Extra.HTML());
              }));
            }).then(() => {
              Promise.resolve(attach).then(each(item => {
                if (item.type == 'photo') {
                  ctx.telegram.sendPhoto(uid, item.content);
                } else if (item.type == 'doc') {
                  ctx.telegram.sendDocument(uid, item.content);
                } else {
                  ctx.telegram.sendMessage(uid, item.content, Extra.HTML());
                }
              }));
            });
          } else {
            ctx.telegram.sendMessage(uid, post, Extra.HTML()).then(() => {
              Promise.resolve(attach).then(each(item => {
                if (item.type == 'photo') {
                  ctx.telegram.sendPhoto(uid, item.content);
                } else if (item.type == 'doc') {
                  ctx.telegram.sendDocument(uid, item.content);
                } else {
                  ctx.telegram.sendMessage(uid, item.content, Extra.HTML());
                }
              }));
            });
          }
        } else {
          ctx.telegram.sendMessage(uid, 'Пост не найден. Проверьте правильность введенной ссылки. #2');
        }
      });
    } else {
      ctx.telegram.sendMessage(uid, 'Пост не найден. Проверьте правильность введенной ссылки. #1');
    }
  };
