"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _timezones = _interopRequireDefault(require("./constants/timezones.js"));

var _mimes2 = _interopRequireDefault(require("./constants/mimes.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _default = {
  accepted: function accepted(_ref) {
    var value = _ref.value;
    return isNotEmpty(value) && value != 0;
  },
  // active_url: ({ value }) => {
  //This cannot be supported because JS does not support hostname lookups (dns_get_record in PHP)
  //This could be implemented if there was a reliable way to host a small API to do the lookup
  // },
  after: function after(_ref2) {
    var value = _ref2.value,
        params = _ref2.params;
    return b(new Date(value) > new Date(params[0]));
  },
  after_or_equal: function after_or_equal(_ref3) {
    var value = _ref3.value,
        params = _ref3.params;
    return b(new Date(value) >= new Date(params[0]));
  },
  alpha: function alpha(_ref4) {
    var value = _ref4.value;
    return b(typeof value === 'string') && !/[^a-z]/i.test(value);
  },
  alpha_dash: function alpha_dash(_ref5) {
    var value = _ref5.value;
    return b(typeof value === 'string') && /^[A-Za-z\-]+$/i.test(value);
  },
  alpha_num: function alpha_num(_ref6) {
    var value = _ref6.value;
    return b(typeof value === 'string') && /^[a-z0-9]+$/i.test(value);
  },
  array: function array(_ref7) {
    var value = _ref7.value;
    return Array.isArray(value);
  },
  //bail: handled in index.js
  before: function before(_ref8) {
    var value = _ref8.value,
        params = _ref8.params;
    return b(new Date(value) < new Date(params[0]));
  },
  before_or_equal: function before_or_equal(_ref9) {
    var value = _ref9.value,
        params = _ref9.params;
    return b(new Date(value) <= new Date(params[0]));
  },
  between: function between(_ref10) {
    var value = _ref10.value,
        params = _ref10.params;
    if (typeof value !== 'number' && !value) return false;

    var _params = _slicedToArray(params, 2),
        min = _params[0],
        max = _params[1];

    value = sizeOf(value);
    return value > min && value < max;
  },
  boolean: function boolean(_ref11) {
    var value = _ref11.value;
    return typeof value === 'boolean';
  },
  confirmed: function confirmed(_ref12) {
    var value = _ref12.value,
        key = _ref12.key,
        values = _ref12.values;
    return b(value === values["".concat(key, "_confirmation")]);
  },
  date: function date(_ref13) {
    var value = _ref13.value;
    return b(typeof value !== 'number' && !isNaN(Date.parse(value)));
  },
  date_equals: function date_equals(_ref14) {
    var value = _ref14.value,
        params = _ref14.params;
    return Date.parse(value) === Date.parse(params[0]);
  },
  //date_format
  different: function different(_ref15) {
    var value = _ref15.value,
        values = _ref15.values,
        params = _ref15.params;
    return b(value !== values[params[0]]);
  },
  //allows same arrays and objects
  digits: function digits(_ref16) {
    var value = _ref16.value,
        params = _ref16.params;
    return !isNaN(value) && (typeof value === 'number' || b(value)) && value.toString().length === parseInt(params[0]);
  },
  digits_between: function digits_between(_ref17) {
    var value = _ref17.value,
        params = _ref17.params;

    if (typeof value !== 'number' && !b(value)) {
      return false;
    }

    var len = value.toString().length;

    var _params2 = _slicedToArray(params, 2),
        min = _params2[0],
        max = _params2[1];

    return len > min && len < max;
  },
  dimensions: function dimensions(_ref18) {
    var value = _ref18.value,
        params = _ref18.params;
    if (!value) return false;
    var width = parseInt(value.width);
    var height = parseInt(value.height);

    for (var i = 0; i < params.length; i++) {
      var param = params[i];
      if (!param) continue;
      var pair = param.split('=');
      var paramVal = parseInt(pair[1]);

      switch (pair[0]) {
        case 'width':
          if (width !== paramVal) return false;
          break;

        case 'min_width':
          if (width < paramVal) return false;
          break;

        case 'max_width':
          if (width > paramVal) return false;
          break;

        case 'height':
          if (height !== paramVal) return false;
          break;

        case 'min_height':
          if (height < paramVal) return false;
          break;

        case 'max_height':
          if (height > paramVal) return false;
          break;
      }
    }

    return true;
  },
  distinct: function distinct(_ref19) {
    var values = _ref19.values,
        value = _ref19.value;
    return Object.keys(values).reduce(function (count, key) {
      if (deepEquals(values[key], value)) {
        count++;
      }

      return count;
    }, 0) <= 1;
  },
  email: function email(_ref20) {
    var value = _ref20.value;
    return /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
  },
  ends_with: function ends_with(_ref21) {
    var value = _ref21.value,
        params = _ref21.params;

    if (Array.isArray(value)) {
      value = value.join("");
    }

    return String(value).endsWith(params[0]);
  },
  file: function file(_ref22) {
    var value = _ref22.value;
    return value instanceof File;
  },
  filled: function filled(_ref23) {
    var value = _ref23.value;
    return isNotEmpty(value);
  },
  gt: function gt(_ref24) {
    var value = _ref24.value,
        values = _ref24.values,
        params = _ref24.params;
    return values[params[0]] === undefined || value > values[params[0]];
  },
  gte: function gte(_ref25) {
    var value = _ref25.value,
        values = _ref25.values,
        params = _ref25.params;
    return values[params[0]] === undefined || value >= values[params[0]];
  },
  image: function image(_ref26) {
    var value = _ref26.value;
    return value instanceof Image;
  },
  in: function _in(_ref27) {
    var value = _ref27.value,
        params = _ref27.params;
    return params.findIndex(function (param) {
      return deepEquals(param, value);
    }) !== -1;
  },
  in_array: function in_array(_ref28) {
    var value = _ref28.value,
        values = _ref28.values,
        params = _ref28.params;
    var array = values[params[0]];
    if (!Array.isArray(array)) return false;
    return array.findIndex(function (arrayVal) {
      return deepEquals(arrayVal, value);
    }) !== -1;
  },
  integer: function integer(_ref29) {
    var value = _ref29.value;
    return Number.isInteger(typeof value === 'string' ? parseInt(value) : value);
  },
  ip: function ip(_ref30) {
    var value = _ref30.value;
    return isIpv4(value) || checkipv6(value);
  },
  ipv4: function ipv4(_ref31) {
    var value = _ref31.value;
    return isIpv4(value);
  },
  ipv6: function ipv6(_ref32) {
    var value = _ref32.value;
    return checkipv6(value);
  },
  json: function json(_ref33) {
    var value = _ref33.value;
    if (typeof value !== 'string') return false;

    try {
      JSON.parse(value);
    } catch (e) {
      return false;
    }

    return true;
  },
  lt: function lt(_ref34) {
    var value = _ref34.value,
        values = _ref34.values,
        params = _ref34.params;
    return value < values[params[0]];
  },
  lte: function lte(_ref35) {
    var value = _ref35.value,
        values = _ref35.values,
        params = _ref35.params;
    return value <= values[params[0]];
  },
  max: function max(_ref36) {
    var value = _ref36.value,
        params = _ref36.params;
    return (b(value) || typeof value === 'number') && sizeOf(value) <= params[0];
  },
  mimetypes: function mimetypes(_ref37) {
    var value = _ref37.value,
        params = _ref37.params;

    if (!value || !value.type) {
      return false;
    }

    return params.includes(value.type);
  },
  mimes: function mimes(_ref38) {
    var value = _ref38.value,
        params = _ref38.params;

    if (!value || !value.type) {
      return false;
    }

    for (var i = 0; i < params.length; i++) {
      var param = params[i];
      var mimeType = _mimes2.default[param];

      if (!mimeType) {
        console.warn("Invalid mime specified: ".concat(param));
        continue;
      }

      if (value.type === mimeType) return true;
    }

    return false;
  },
  min: function min(_ref39) {
    var value = _ref39.value,
        params = _ref39.params;
    return (b(value) || typeof value === 'number') && sizeOf(value) >= params[0];
  },
  not_in: function not_in(_ref40) {
    var value = _ref40.value,
        params = _ref40.params;
    return params.findIndex(function (param) {
      return deepEquals(param, value);
    }) === -1;
  },
  //not_regex
  //nullable: implemented in `validateField` method (index.js)
  numeric: function numeric(_ref41) {
    var value = _ref41.value;

    if (typeof value === 'number') {
      return true;
    }

    if (!value) {
      return false;
    }

    return !isNaN(value);
  },
  present: function present(_ref42) {
    var value = _ref42.value;
    return value !== undefined;
  },
  //regex
  required: function required(_ref43) {
    var value = _ref43.value;
    return isNotEmpty(value);
  },
  required_if: function required_if(_ref44) {
    var value = _ref44.value,
        params = _ref44.params,
        values = _ref44.values;
    return values[params[0]] == params[1] ? isNotEmpty(value) : true;
  },
  required_unless: function required_unless(_ref45) {
    var value = _ref45.value,
        params = _ref45.params,
        values = _ref45.values;
    return values[params[0]] != params[1] ? isNotEmpty(value) : true;
  },
  required_with: function required_with(_ref46) {
    var value = _ref46.value,
        params = _ref46.params,
        values = _ref46.values;
    var required = Object.keys(values).filter(function (key) {
      return params.includes(key) ? isNotEmpty(values[key]) : false;
    }).length > 0;
    return !required || isNotEmpty(value);
  },
  required_with_all: function required_with_all(_ref47) {
    var value = _ref47.value,
        params = _ref47.params,
        values = _ref47.values;
    var required = Object.keys(values).filter(function (key) {
      return params.includes(key) ? isNotEmpty(values[key]) : false;
    }).length === params.length;
    return !required || isNotEmpty(value);
  },
  required_without: function required_without(_ref48) {
    var value = _ref48.value,
        params = _ref48.params,
        values = _ref48.values;
    var required = Object.keys(values).filter(function (key) {
      return params.includes(key) ? !isNotEmpty(values[key]) : false;
    }).length > 0;
    return !required || isNotEmpty(value);
  },
  required_without_all: function required_without_all(_ref49) {
    var value = _ref49.value,
        params = _ref49.params,
        values = _ref49.values;
    var required = Object.keys(values).filter(function (key) {
      return params.includes(key) ? !isNotEmpty(values[key]) : false;
    }).length === params.length;
    return !required || isNotEmpty(value);
  },
  same: function same(_ref50) {
    var value = _ref50.value,
        values = _ref50.values,
        params = _ref50.params;
    return b(value === values[params[0]]);
  },
  //allows same arrays and objects
  size: function size(_ref51) {
    var value = _ref51.value,
        params = _ref51.params;
    var size = !b(value) && typeof value !== 'number' ? 0 : sizeOf(value);
    return size === parseInt(params[0]);
  },
  starts_with: function starts_with(_ref52) {
    var value = _ref52.value,
        params = _ref52.params;

    if (Array.isArray(value)) {
      value = value.join("");
    }

    return String(value).startsWith(params[0]);
  },
  string: function string(_ref53) {
    var value = _ref53.value;
    return typeof value === 'string';
  },
  timezone: function timezone(_ref54) {
    var value = _ref54.value;
    return _timezones.default.includes(value);
  },
  url: function url(_ref55) {
    var value = _ref55.value;
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  },
  uuid: function uuid(_ref56) {
    var value = _ref56.value;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }
};
/*****************************/

/** START OF UTIL FUNCTIONS **/

/*****************************/
//These functions are tested through rules that use them

exports.default = _default;

function isNotEmpty(value) {
  return typeof value === 'number' || typeof value === 'boolean' || !!value;
}

function sizeOf(value) {
  //TODO files, images other things
  if (value.hasOwnProperty('length')) {
    value = value.length;
  }

  return value;
}

function b(value) {
  return !!value;
}

function isIpv4(value) {
  return /^(?:\d{1,3}(?:\.|$)){4}/.test(value);
} // Created by Dartware
//http://download.dartware.com/thirdparty/ipv6validator.js


function checkipv6(str) {
  return /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(str);
}

function deepEquals(x, y) {
  if (x === y) {
    return true;
  } else if (_typeof(x) == "object" && x != null && _typeof(y) == "object" && y != null) {
    if (Object.keys(x).length != Object.keys(y).length) return false;

    for (var prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEquals(x[prop], y[prop])) return false;
      } else return false;
    }

    return true;
  } else return false;
}