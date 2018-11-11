// Based on laravel validation rules
// https://laravel.com/docs/5.7/validation#rule-accepted


export default {
  accepted: ({ value }) => isNotEmpty(value),

  after: ({ value, params }) => b(new Date(value) > new Date(params[0])),
  after_or_equal: ({ value, params }) => b(new Date(value) >= new Date(params[0])),

  alpha: ({ value }) => !/[^a-z]/i.test(value),
  alpha_dash: ({ value }) => /^[A-Za-z\-]+$/i.test(value),
  alpha_num: ({ value }) => /^[a-z0-9]+$/i.test(value),

  array: ({ value }) => Array.isArray(value),

  //bail: is on by default and can be set in `validateForm` call

  before: ({ value, params }) => b(new Date(value) < new Date(params[0])),
  before_or_equal: ({ value, params }) => b(new Date(value) <= new Date(params[0])),

  between: ({ value, params }) => {
    const [min, max] = params;
    value = sizeOf(value);
    return value > min && value < max;
  },

  boolean: ({ value }) => typeof value === 'boolean',

  confirmed: ({ value, key, values }) => b(value === values[`${key}_confirmed`]),
  
  date: ({ value }) => (Date.parse(value) !== NaN),
  date_equals: ({ value, params }) => (Date.parse(value) !== NaN && Date.parse(value) === Date.parse(params[0])),
  //date_format

  different: ({ value, values, params }) => b(value != values[params[0]]),//allows same arrays and objects

  digits: ({ value, params }) => !isNaN(value) && value.toString().length === parseInt(params[0]),
  digits_between: ({ value, params }) => {
    const len = value.toString().length;
    const [min, max] = params;
    return len > min && len < max;
  },

  // dimensions: ({ value, params }) => {
  //   if (value.hasOwnProperty('width') && value.hasOwnProperty('height')) {
  //     return
  //   }
  // }

  distinct: ({ values, value }) => {
    return (Object.keys(values).reduce((count, key) => {
      if (values[key] == value) {
        count++;
      }
      return count;
    }, 0) === 1);
  },

  email: ({ value }) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value),

  file: ({ value }) => value instanceof File,

  filled: ({ value }) => isNotEmpty(value),

  gt: ({ value, values, params }) => value > values[params[0]],
  gte: ({ value, values, params }) => value >= values[params[0]],

  image: ({ value }) => value instanceof Image,

  in: ({ value, params }) => params.includes(value),
  in_array: ({ value, params }) => params[0].includes(value),
  
  integer: ({ value }) => {
    return Number.isInteger(typeof value === 'string' ? parseInt(value) : value);
  },

  ip: ({ value }) => isIpv4(value) || checkipv6(value),
  ipv4: ({ value }) => isIpv4(value),
  ipv6: ({ value }) => checkipv6(value),

  json: ({ value }) => {
    try { JSON.parse(value ); } catch (e) { return false ;}
    return true;
  },

  lt: ({ value, values, params }) => value < values[params[0]],
  lte: ({ value, values, params }) => value <= values[params[0]],

  max: ({ value, params }) => sizeOf(value) <= params[0],

  //mimetypes?

  min: ({ value, params }) => sizeOf(value) >= params[0],

  not_in: ({ value, params }) => !params.includes(value),
  //not_regex

  numeric: ({ value }) => typeof value === 'number',

  present: ({ value }) => value !== undefined,

  //regex

  required: ({ value }) => isNotEmpty(value),
  required_if: ({ value, params, values }) => values[params[0]] == params[1] ? isNotEmpty(value) : true,
  required_unless: ({ value, params, values }) => values[params[0]] != params[1] ? isNotEmpty(value) : true,
  required_with: ({ value, params, values }) => {
    const required = Object.keys(values).filter(
      key => params.includes(key) ? isNotEmpty(values[key]) : false 
    ).length > 0;
    return !required || isNotEmpty(value);
  },
  required_with_all: ({ value, params, values }) => {
    const required = Object.keys(values).filter(
      key => params.includes(key) ? isNotEmpty(values[key]) : false
    ).length === params.length;
    return !required || isNotEmpty(value);
  },
  // required_without
  // required_without_all

  same: ({ value, values, params }) => b(value == values[params[0]]),//allows same arrays and objects

  size: ({ value, params }) => sizeOf(value) === parseInt(params[0]),

  string: ({ value }) => typeof value === 'string',

  //timezone
};


/*****************************/
/** START OF UTIL FUNCTIONS **/
/*****************************/


function isNotEmpty(value) {
  return !! value;
}

function sizeOf(value) {
  //TODO files, images other things
  if (value.hasOwnProperty('length')) {
    value = value.length;
  }
  return value;
}

function b(value) {
  return isNotEmpty(value)
}

function isIpv4(value) {
  return /^(?:\d{1,3}(?:\.|$)){4}/.test(value);
}

// Created by Dartware
//http://download.dartware.com/thirdparty/ipv6validator.js
function checkipv6(str) {
	return (/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(str));
}