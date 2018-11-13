
const messages = {
  /*accepted: () => "",

  // active_url: ({ value }) => {
    //This cannot be supported because JS does not support hostname lookups (dns_get_record in PHP)
    //This could be implemented if there was a reliable way to host a small API to do the lookup
  // },

  after: () => "",
  after_or_equal: () => "",

  alpha: () => "",
  alpha_dash: () => "",
  alpha_num: () => "",

  array: () => "",

  //bail: is on by default but is `validateForm` call

  before: () => "",
  before_or_equal: () => "",

  between: () => "",

  boolean: () => "",

  confirmed: () => "",
  
  date: () => "",
  date_equals: () => "",

  //date_format

  different: () => "",

  digits: () => "",
  digits_between: () => "",

  distinct: () => "",

  email: () => "",

  file: () => "",

  filled: () => "",

  gt: () => "",
  gte: () => "",

  image: () => "",

  in: () => "",
  in_array: () => "",
  
  integer: () => "",

  ip: () => "",
  ipv4: () => "",
  ipv6: () => "",

  json: () => "",

  lt: () => "",
  lte: () => "",

  max: () => "",

  //mimetypes?

  min: () => "",

  not_in: () => "",

  //not_regex

  //nullable: implemented in `validateField` method (index.js)

  numeric: () => "",

  present: () => "",

  //regex

  required: () => "",
  required_if: () => "",
  required_unless: () => "",
  required_with: () => "",
  required_with_all: () => "",
  required_without: () => "",
  required_without_all: () => "",

  same: () => "",

  size: () => "",

  string: () => "",

  timezone: () => "",

  url: () => "",

  uuid: () => "",*/
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

function getMessage(rule, params) {
  if (messages[rule] === undefined) {
    return rule;
  }
  return messages[rule](params);
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