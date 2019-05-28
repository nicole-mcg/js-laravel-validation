import {
    setMessageHandlers,
    setMessageHandler,
    getMessage,
    getMessageHandler,
} from './messages';

import {
    generateMessage,
} from './placeholders';

import { validate } from './index';

const validation = {
    setMessageHandlers,
    setMessageHandler,
    getMessage: generateMessage,
    getMessageHandler,
    validateForm: validate.validateForm,
}

exports.validation = validation;
