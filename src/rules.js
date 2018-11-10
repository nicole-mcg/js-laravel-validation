// Based on laravel validation rules
// https://laravel.com/docs/5.7/validation#rule-accepted


export default {
  //key: verify function
  'accepted': ({ value }) => isNotEmpty(value), // Use for license accept fields (must be truthy)

  'after': ({ value, params }) => !!(new Date(value) > new Date(params[0])),
  'after_or_equal': ({ value, params }) => !!(new Date(value) >= new Date(params[0])),

  'alpha': ({ value }) => !/[^a-z]/i.test(value), // Value is only letters
  'alpha_dash': ({ value }) => /^[A-Za-z\-]+$/i.test(value),
  'alpha_num': ({ value }) => /^[a-z0-9]+$/i.test(value),

  'array': ({ value }) => Array.isArray(value),

  //bail: is on by default and can be set in `validateForm` call

  'before': ({ value, params }) => !!(new Date(value) < new Date(params[0])),
  'before_or_equal': ({ value, params }) => !!(new Date(value) <= new Date(params[0])),

  'between': ({ value, params }) => {
    const [min, max] = params;

    if (value.hasOwnProperty('length')) {
      value = value.length;
    }

    return value > min && value < max;
  },

  'boolean': ({ value }) => typeof value === 'boolean',

  'confirmed': ({ value, key, values }) => !!(value === values[`${key}_confirmed`]),
  'date': ({ value }) => (Date.parse(value) !== NaN),

  'distinct': ({ values, value }) => {
    return (Object.keys(values).reduce((count, key) => {
      if (values[key] == value) {
        count++;
      }
      return count;
    }, 0) === 1);
  },
  'email': ({ value }) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value),
  'filled': ({ value }) => isNotEmpty(value),
  'integer': ({ value }) => {
    return Number.isInteger(typeof value === 'string' ? parseInt(value) : value);
  },
  'json': ({ value }) => {
    try { JSON.parse(value ); } catch (e) { return false ;}
    return true;
  },
  'numeric': ({ value }) => !isNaN(value),
  'present': ({ value }) => value !== undefined,
  'required': ({ value }) => isNotEmpty(value),
  'string': ({ value }) => typeof value === 'string',
};

function isNotEmpty(value) {
  return !! value;
}