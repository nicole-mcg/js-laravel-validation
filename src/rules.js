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

    if (value.hasOwnProperty('length')) {
      value = value.length;
    }

    return value > min && value < max;
  },

  boolean: ({ value }) => typeof value === 'boolean',

  confirmed: ({ value, key, values }) => b(value === values[`${key}_confirmed`]),
  
  date: ({ value }) => (Date.parse(value) !== NaN),
  date_equals: ({ value, params }) => (Date.parse(value) !== NaN && Date.parse(value) === Date.parse(params[0])),
  //date_format

  different: ({ value, values, params }) => !b(value == values[params[0]]),//allows same arrays and objects

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

  //ip
  //ipv4
  //ipv6

  json: ({ value }) => {
    try { JSON.parse(value ); } catch (e) { return false ;}
    return true;
  },

  //lt
  //lte

  //max

  //mimetypes?

  //min

  //not_in
  //not_regex

  numeric: ({ value }) => !isNaN(value),
  present: ({ value }) => value !== undefined,

  //regex

  required: ({ value }) => isNotEmpty(value),

  //required_if
  //required_unless
  //required_with
  //required_with_all
  //required_without

  //same

  //size

  string: ({ value }) => typeof value === 'string',

  //timezone
};

function isNotEmpty(value) {
  return !! value;
}

function b(value) {
  return isNotEmpty(value)
}