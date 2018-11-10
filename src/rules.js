// Based on laravel validation rules
// https://laravel.com/docs/5.7/validation#rule-accepted


export default {
  //key: verify function
  'accepted': ({ value }) => isNotEmpty(value), // Use for license accept fields (must be truthy)
  'alpha': ({ value }) => !/[^a-z]/i.test(value), // Value is only letters
  'array': ({ value }) => Array.isArray(value),
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
    return Number.isInteger(typeof value === 'string' ? parseInt(value) : value)
  },
  'json': ({ value }) => {
    try { JSON.parse(value ) } catch (e) { return false }
    return true;
  },
  'numeric': ({ value }) => !isNaN(value),
  'present': ({ value }) => value !== undefined,
  'required': ({ value }) => isNotEmpty(value),
  'string': ({ value }) => typeof value === 'string',
}

function isNotEmpty(value) {
  return !! value;
}