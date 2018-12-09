import {
    setMessageHandlers,
    setMessageHandler,
} from './messages';

import { validate } from './index';

// var messages = require('./messages');
// var validate = require('./index').validate;

//console.log('api validate=', validate)

// exports.setMessageHandler = messages.setMessageHandler;
// exports.setMessageHandler = messages.setMessageHandler;
// exports.getMessage = messages.getMessage;
// exports.getMessageHandler = messages.getMessageHandler;
// exports.validateForm = validate.validateForm;

const validation = {
    setMessageHandlers,
    setMessageHandler,
    getMessage,
    getMessageHandler,
    validateForm: validate.validateForm,
}

exports.validation = validation;
