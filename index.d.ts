export type MessageHandler = (field: IValidationFormField) => string;

export interface IValidationFormField {
    [index: string]: any;
    value: any;
    validation: string;
}

export interface IValidateFormOptions {
    formData: { [fieldName: string]: IValidationFormField };
    includeMessages?: boolean;
}

export interface IValidationErrors {
    [fieldName: string]: string[];
}

export interface ValidationResult {
    errors?: IValidationErrors;
}

export function validateForm(options: IValidateFormOptions): ValidationResult;

export function setMessageHandlers(newMessages: { [rule: string]: MessageHandler }): void;
export function setMessageHandler(rule: string, createMessage: MessageHandler): void;
