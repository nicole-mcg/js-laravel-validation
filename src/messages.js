
export const messages = {
    accepted: () => "The :attribute must be accepted.",

    // active_url: ({ value }) => {
      //This cannot be supported because JS does not support hostname lookups (dns_get_record in PHP)
      //This could be implemented if there was a reliable way to host a small API to do the lookup
    // },

    after: () => "The :attribute must be a date after :date.",
    after_or_equal: () => "The :attribute must be a date after or equal to :date.",

    alpha: () => "The :attribute may only contain letters.",
    alpha_dash: () => "The :attribute may only contain letters, numbers, dashes and underscores.", // I don't think that's what this rule does
    alpha_num: () => "The :attribute may only contain letters and numbers.",

    array: () => "The :attribute must be an array.",

    //bail: is on by default but is `validateForm` call

    before: () => "The :attribute must be a date before :date.",
    before_or_equal: () => "The :attribute must be a date before or equal to :date.",

    between: () => "The :attribute must be between :min and :max.",

    boolean: () => "The :attribute field must be true or false.",

    confirmed: () => "The :attribute confirmation does not match.",
    
    date: () => "The :attribute is not a valid date.",
    date_equals: () => "The :attribute must be a date equal to :date.",

    //date_format: () => "The :attribute does not match the format :format.",

    different: () => "The :attribute and :other must be different.",

    digits: () => "The :attribute must be :digits digits.",
    digits_between: () => "The :attribute must be between :min and :max digits.",

    dimensions: () => "The :attribute has invalid image dimensions.",

    distinct: () => "The :attribute field has a duplicate value.",

    email: () => "The :attribute must be a valid email address.",

    file: () => "The :attribute must be a file.",

    filled: () => "The :attribute field must have a value.",

    gt: () => "", // TODO this one is more complicated
    gte: () => "", // TODO this one is more complicated

    image: () => "The :attribute must be an image.",

    in: () => "The selected :attribute is invalid.",
    in_array: () => "The :attribute field does not exist in :other.",
    
    integer: () => "The :attribute must be an integer.",

    ip: () => "The :attribute must be a valid IP address.",
    ipv4: () => "The :attribute must be a valid IPv4 address.",
    ipv6: () => "The :attribute must be a valid IPv6 address.",

    json: () => "The :attribute must be a valid JSON string.",

    lt: () => "", // TODO this is more complicated, and is it done with size?
    lte: () => "", // TODO this is more complicated, and is it done with size?

    max: () => "The :attribute must be maximal :max.", // TODO this is more complicated, and is it done with size?

    // mimes?
    // mimetypes?

    min: () => "The :attribute must be at least :min.", // TODO this is more complicated, and is it done with size?

    not_in: () => "The selected :attribute is invalid.",

    //not_regex

    //nullable: implemented in `validateField` method (index.js)

    numeric: () => "The :attribute must be a number.",

    present: () => "The :attribute field must be present.",

    //regex

    required: () => "The :attribute field is required.",
    required_if: () => "The :attribute field is required when :other is :value.",
    required_unless: () => "The :attribute field is required unless :other is in :values.",
    required_with: () => "The :attribute field is required when :values is present.",
    required_with_all: () => "The :attribute field is required when :values are present.",
    required_without: () => "The :attribute field is required when :values is not present.",
    required_without_all: () => "The :attribute field is required when none of :values are present.",

    same: () => "The :attribute and :other must match.",

    size: () => "", // TODO this is more complicated
    
    // TODO starts_with

    string: () => "The :attribute must be a string.",

    timezone: () => "The :attribute must be a valid zone.",

    // TODO unique

    url: () => "The :attribute format is invalid.",

    uuid: () => "The :attribute must be a valid UUID.",
};

//export default messages;

function setMessageHandlers(newMessages) {
    Object.assign(messages, newMessages);
}

function setMessageHandler(rule, createMessage) {
    setMessageHandlers({
      [rule]: createMessage
    });
}

function getMessage(rule, fieldData) {
    if (messages[rule] === undefined) {
        return "";
    }
    return messages[rule](fieldData);
}

function getMessageHandler(rule) {
    return messages[rule];
}

export {
    setMessageHandlers,
    setMessageHandler,
    getMessage,
    getMessageHandler,
}