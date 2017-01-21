const request = require('request');
const config = require('../../config');
const photo = require('./photo')();
const link = require('./link')();
const video = require('./video')();
const audio = require('./audio')();
const poll = require('./poll')();
const page = require('./page')();
const doc = require('./doc')();

var Attachments = () => {
  return (item, isRepost, linksToAttachments) => {
    var attachments = item.attachments || isRepost[0].attachments;

    attachments.forEach((attach, i) => {
      photo(attach, linksToAttachments, i);
      link(attach);
      video(attach);
      audio(attach);
      poll(attach);
      page(attach, config, request, linksToAttachments, i);
      doc(attach, linksToAttachments, i);
    });
  }
};

module.exports = Attachments;
