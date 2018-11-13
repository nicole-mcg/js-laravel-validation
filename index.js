var api = require('./dist/api.bundle').validation;

exports.setMessageHandlers = api.setMessageHandlers;
exports.setMessageHandler = api.setMessageHandler;
exports.getMessage = api.getMessage;
exports.getMessageHandler = api.getMessageHandler;
exports.validateForm = api.validateForm;