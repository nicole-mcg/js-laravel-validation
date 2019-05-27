
const PLACEHOLDER_REGEX = /:([A-z]+[A-z0-9]*)/;

export function generateMessage(rule, fieldData) {
    const message = getMessage(rule, fieldData);

    return replacePlaceholders(message, { rule, ...fieldData });
}

function replacePlaceholders(message, fieldData) {
    let placeholderMatch = message.match(PLACEHOLDER_REGEX);
    while(placeholderMatch) {
        const replacementValue = fieldData[placeholderMatch[1]];
        message = message.replace(placeholderMatch[0], replacementValue);
        placeholderMatch = message.match(PLACEHOLDER_REGEX);
    }
    return message;
}