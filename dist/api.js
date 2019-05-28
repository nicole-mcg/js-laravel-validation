"use strict";

var _messages = require("./messages");

var _placeholders = require("./placeholders");

var _index = require("./index");

var validation = {
  setMessageHandlers: _messages.setMessageHandlers,
  setMessageHandler: _messages.setMessageHandler,
  getMessage: _placeholders.generateMessage,
  getMessageHandler: _messages.getMessageHandler,
  validateForm: _index.validate.validateForm
};
exports.validation = validation;