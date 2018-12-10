"use strict";

var _messages = require("./messages");

var _index = require("./index");

// var messages = require('./messages');
// var validate = require('./index').validate;
//console.log('api validate=', validate)
// exports.setMessageHandler = messages.setMessageHandler;
// exports.setMessageHandler = messages.setMessageHandler;
// exports.getMessage = messages.getMessage;
// exports.getMessageHandler = messages.getMessageHandler;
// exports.validateForm = validate.validateForm;
var validation = {
  setMessageHandlers: _messages.setMessageHandlers,
  setMessageHandler: _messages.setMessageHandler,
  getMessage: getMessage,
  getMessageHandler: getMessageHandler,
  validateForm: _index.validate.validateForm
};
exports.validation = validation;