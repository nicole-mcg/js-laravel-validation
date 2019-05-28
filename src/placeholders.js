import { getMessage } from './messages'

export const PLACEHOLDER_REGEX = /:([A-z]+[A-z0-9]*)/;

export const DEFAULT_PLACEHOLDERS = {
    "after": {
        date: ({ params }) => params[0],
    },
    "after_or_equal": {
        date: ({ params }) => params[0],
    },
    "between": {
        min: ({ params }) => params[0],
        max: ({ params }) => params[1], 
    },
    "before": {
        date: ({ params }) => params[0],
    },
    "before_or_equal": {
        date: ({ params }) => params[0],
    },
    "before": {
        date: ({ params }) => params[0],
    },
    "date_equals": {
        date: ({ params }) => params[0],
    },
    "dimensions": {
        // TODO
    },
    "ends_with": {
        values: ({ params }) => params.length > 1 ? params : params[0],
    },
    "gt": {
        value: ({ params }) => params[0],
    },
    "gte": {
        value: ({ params }) => params[0],
    },
    "in": {
        values: ({ params }) => params,
    },
    "in_array": {
        other: ({ params }) => params[0],
    },
    "lt": {
        value: ({ params }) => params[0],
    },
    "lte": {
        value: ({ params }) => params[0],
    },
    "max": {
        max: ({ params }) => params[0],
    },
    "min": {
        min: ({ params }) => params[0],
    },
    "required_if": {
        other: ({ params }) => params[0],
        value: ({ params }) => params[1],
    },
    "required_with": {
        values: ({ params }) => params,
    },
    "required_with_all": {
        values: ({ params }) => params,
    },
    "required_without": {
        values: ({ params }) => params,
    },
    "required_without_all": {
        values: ({ params }) => params,
    },
    "required_unless": {
        other: ({ params }) => params[0],
        value: ({ params }) => params[1],
    },
    "same": {
        other: ({ params }) => params[0],
    },
    "size": {
        size: ({ params }) => params[0],
    },
    "starts_with": {
        values: ({ params }) => params.length > 1 ? params : params[0],
    },
};

export function generateMessage(rule, fieldData) {
    const message = getMessage(rule, fieldData);

    return replacePlaceholders(message, { rule, ...fieldData });
}

function replacePlaceholders(message, fieldData) {
    let placeholderMatch = message.match(PLACEHOLDER_REGEX);
    while(placeholderMatch) {
        const matchedString = placeholderMatch[0];
        let placeholder = placeholderMatch[1];
        if (placeholder === "attribute") {
            placeholder = "name";
        }

        const replacementValue = fieldData[placeholder];

        if (replacementValue === null || replacementValue === undefined) {
            
            
            replacementValue = getDefaultPlaceholderValue(placeholder, fieldData) || "";
        }

        message = message.split(matchedString).join(replacementValue);
        placeholderMatch = message.match(PLACEHOLDER_REGEX);
    }
    return message;
}

function getDefaultPlaceholderValue(placeholder, fieldData) {
    const rulePlaceholders = DEFAULT_PLACEHOLDERS[fieldData.rule];

    if (!rulePlaceholders) {
        return null;
    }

    const placeholderFunc = rulePlaceholders[placeholder];
    return placeholderFunc && placeholderFunc(fieldData);
}