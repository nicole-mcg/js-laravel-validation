import {
    setMessageHandlers,
    setMessageHandler,
    getMessage,
    getMessageHandler,
} from './messages';

import { validate } from './index';

const validation = {
    setMessageHandlers,
    setMessageHandler,
    getMessage,
    getMessageHandler,
    validateForm: validate.validateForm,
}

exports.validation = validation;
