

var validation = {
    setMessageHandlers: _messages.setMessageHandlers,
    setMessageHandler: _messages.setMessageHandler,
    getMessage: _messages.getMessage,
    getMessageHandler: _messages.getMessageHandler,
    validateForm: _index.validate.validateForm
  };
exports.validation = validation;

export type MessageHandler = (field: any) => string;

export interface IValidationFormField {
    [index: string]: any;
    value: any;
    validation: string;
}

export interface IValidateFormOptions {
    formData: { [fieldName: string]: IValidationFormField };
    includeMessages: boolean;
}

export interface IValidationErrors {
    [fieldName: string]: string[];
}

export interface ValidationResult {
    errors?: IValidationErrors;
}

export const validation: {
    validateForm: (options: IValidateFormOptions) => ValidationResult;

    setMessageHandlers: (newMessages: { [rule: string]: MessageHandler }) => void;
    setMessageHandler: (rule: string, createMessage: MessageHandler) => void;
    getMessage: (rule: string, field: any) => string;
    getMessageHandler: (rule: string) => MessageHandler; 
}
