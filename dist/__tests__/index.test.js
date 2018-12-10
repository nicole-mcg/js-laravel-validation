"use strict";

var _index = require("../index");

var _rules = _interopRequireDefault(require("../rules"));

var _messages = require("../messages");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validateField = _index.validate.validateField,
    validateForm = _index.validate.validateForm,
    parseRule = _index.validate.parseRule;
var oldRules = Object.assign({}, _rules.default);
describe('Custom messages', function () {
  it('can override an existing message', function () {
    (0, _messages.setMessageHandler)('test', function () {
      return 'hey!';
    });
    expect((0, _messages.getMessageHandler)('test')).toBeTruthy();
    expect((0, _messages.getMessage)('test')).toEqual('hey!');
  });
  it('can override existing messages', function () {
    (0, _messages.setMessageHandlers)({
      test: function test() {
        return 'hey!';
      },
      test2: function test2() {
        return 'hello';
      }
    });
    expect((0, _messages.getMessageHandler)('test')).toBeTruthy();
    expect((0, _messages.getMessage)('test')).toEqual('hey!');
    expect((0, _messages.getMessageHandler)('test2')).toBeTruthy();
    expect((0, _messages.getMessage)('test2')).toEqual('hello');
  });
});
describe('Form Validator', function () {
  var mockedRules = [];
  var mockedMessages = {};

  function mockValidateField(returnVal) {
    var mock = jest.fn();
    mock.mockReturnValue(returnVal);
    _index.validate.validateField = mock;
    return mock;
  }

  function mockRule(name, returnVal) {
    var mock = jest.fn();
    mock.mockReturnValue(returnVal);
    _rules.default[name] = mock;
    mockedRules.push(name);
    return mock;
  }

  function mockMessage(rule, returnVal) {
    var mock = jest.fn();
    mock.mockReturnValue(returnVal);
    mockedMessages[rule] = (0, _messages.getMessageHandler)(rule);
    (0, _messages.setMessageHandler)(rule, mock);
    return mock;
  }

  function restoreMocks() {
    _index.validate.validateForm = validateForm;
    _index.validate.validateField = validateField;
    mockedRules.forEach(function (rule) {
      return _rules.default[rule] = oldRules[rule];
    });
    mockedRules.length = 0;
    Object.keys(mockedMessages).forEach(function (rule) {
      return (0, _messages.setMessageHandler)(rule, mockedMessages[rule]);
    });
    mockedMessages.length = 0;
  }

  describe('validateForm', function () {
    it('can pass field data to validateField', function () {
      var formData = {
        test: {
          value: 1,
          validation: 'required'
        }
      };
      var validateField = mockValidateField({});
      validateForm({
        formData: formData
      });
      expect(validateField).toHaveBeenCalledWith({
        key: 'test',
        value: 1,
        validation: ['required']
      }, formData);
      restoreMocks();
    });
    it('can return an error', function () {
      var formData = {
        test: {
          validation: 'required'
        }
      };
      var validateField = mockValidateField({
        errors: ['required']
      });
      expect(validateForm({
        formData: formData,
        includeMessages: false
      })).toEqual({
        errors: {
          test: ['required']
        }
      });
      expect(validateField).toHaveBeenCalled();
      restoreMocks();
    });
    it('can return an error with a message', function () {
      var formData = {
        test: {
          value: "testVal",
          validation: 'testRule',
          customProp: 1
        }
      };
      var validateField = mockValidateField({
        errors: ['testRule']
      });
      var messageMock = mockMessage('testRule', 'hello');
      expect(validateForm({
        formData: formData,
        includeMessages: true
      })).toEqual({
        errors: {
          test: ['hello']
        }
      });
      expect(validateField).toHaveBeenCalled();
      expect(messageMock).toHaveBeenCalledWith({
        key: 'test',
        validation: ['testRule'],
        value: 'testVal',
        customProp: 1
      });
      restoreMocks();
    });
    it('can bail on first error', function () {
      var formData = {
        test: {
          value: null,
          validation: 'required|bail'
        },
        test2: {
          value: null,
          validation: 'required'
        }
      };
      var validateField = mockValidateField();
      validateField.mockReturnValueOnce({
        errors: ['required']
      });
      validateField.mockReturnValueOnce({
        errors: ['required']
      });
      expect(validateForm({
        formData: formData,
        includeMessages: false
      })).toEqual({
        errors: {
          test: ['required']
        }
      });
      restoreMocks();
    });
    it('can bail on first error if bail is on second field', function () {
      var formData = {
        test: {
          value: null,
          validation: 'required'
        },
        test2: {
          value: null,
          validation: 'required|bail'
        }
      };
      var validateField = mockValidateField();
      validateField.mockReturnValueOnce({
        errors: ['required']
      });
      validateField.mockReturnValueOnce({
        errors: ['required']
      });
      expect(validateForm({
        formData: formData,
        includeMessages: false
      })).toEqual({
        errors: {
          test: ['required']
        }
      });
      restoreMocks();
    });
    it('can bail on first error if bail is on third field', function () {
      var formData = {
        test: {
          value: null,
          validation: 'required'
        },
        test2: {
          value: null,
          validation: 'required'
        },
        test3: {
          value: null,
          validation: 'required|bail'
        }
      };
      var validateField = mockValidateField();
      validateField.mockReturnValueOnce({
        errors: ['required']
      });
      validateField.mockReturnValueOnce({
        errors: ['required']
      });
      validateField.mockReturnValueOnce({
        errors: ['required']
      });
      expect(validateForm({
        formData: formData,
        includeMessages: false
      })).toEqual({
        errors: {
          test: ['required']
        }
      });
      restoreMocks();
    });
    it('will only give an error for first field error on bail', function () {
      var formData = {
        test: {
          value: null,
          validation: 'required|string|bail'
        }
      };
      var validateField = mockValidateField();
      validateField.mockReturnValueOnce({
        errors: ['required', 'string']
      });
      expect(validateForm({
        formData: formData,
        includeMessages: false
      })).toEqual({
        errors: {
          test: ['required']
        }
      });
      restoreMocks();
    });
  });
  describe('parseRule', function () {
    it('can parse a rule with no params', function () {
      expect(parseRule('test')).toEqual({
        key: 'test',
        params: []
      });
    });
    it('can parse a rule with one param', function () {
      expect(parseRule('test:0')).toEqual({
        key: 'test',
        params: ["0"]
      });
    });
    it('can parse a rule with two params', function () {
      expect(parseRule('test:0,1')).toEqual({
        key: 'test',
        params: ["0", "1"]
      });
    });
  });
  describe('validateField', function () {
    function createFieldData() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$key = _ref.key,
          key = _ref$key === void 0 ? "test" : _ref$key,
          value = _ref.value,
          validation = _ref.validation;

      return {
        key: key,
        value: value,
        validation: validation
      };
    }

    var oldWarn = console.warn;
    beforeEach(function () {
      console.warn = jest.fn();
    });
    afterEach(function () {
      console.warn = oldWarn;
    });
    it('can allow a field with no rules', function () {
      var fieldData = createFieldData({
        value: "hey",
        validation: ['required']
      });
      expect(validateField(fieldData)).toEqual({
        errors: false
      });
      expect(console.warn).not.toHaveBeenCalled();
    });
    it('can allow a validated field', function () {
      var fieldData = createFieldData({
        value: "hey",
        validation: ['required']
      });
      expect(validateField(fieldData)).toEqual({
        errors: false
      });
      expect(console.warn).not.toHaveBeenCalled();
    });
    it('can allow a field with no rules', function () {
      var fieldData = createFieldData({
        value: "hey",
        validation: ['required']
      });
      expect(validateField(fieldData)).toEqual({
        errors: false
      });
      expect(console.warn).not.toHaveBeenCalled();
    });
    it('can allow a nullable field', function () {
      var fieldData = createFieldData({
        value: null,
        validation: ['test', 'nullable']
      });
      var ruleMock = mockRule('test', false);
      expect(validateField(fieldData)).toEqual({
        errors: false
      });
      expect(console.warn).not.toHaveBeenCalled();
      expect(ruleMock).toHaveBeenCalled();
      restoreMocks();
    });
    it('can detect an invalid field', function () {
      var result = validateField(createFieldData({
        validation: ['required']
      }));
      expect(result.errors).toEqual(['required']);
      expect(console.warn).not.toHaveBeenCalled();
    });
    it('can detect multiple rules on one field', function () {
      var result = validateField(createFieldData({
        validation: ['required', 'string']
      }));
      expect(result.errors).toEqual(['required', 'string']);
      expect(console.warn).not.toHaveBeenCalled();
    });
    it('will throw a warning if there is an unknown rule', function () {
      var fieldData = createFieldData({
        validation: ['unknown']
      });
      expect(validateField(fieldData)).toEqual({
        errors: false
      });
      expect(console.warn).toHaveBeenCalled();
    });
    it('will throw a warning if a nullable field has an unknown rule', function () {
      var fieldData = createFieldData({
        validation: ['unknown', 'nullable']
      });
      expect(validateField(fieldData)).toEqual({
        errors: false
      });
      expect(console.warn).toHaveBeenCalled();
    });
    it('will throw a warning if there is an error validating rule', function () {
      var fieldData = createFieldData({
        validation: ['testRule']
      });
      var ruleMock = mockRule('testRule');
      ruleMock.mockImplementation(function () {
        throw new Error();
      });
      expect(validateField(fieldData)).toEqual({
        errors: ['testRule']
      });
      expect(console.warn).toHaveBeenCalled();
      expect(ruleMock).toHaveBeenCalled();
      restoreMocks();
    });
    it('will throw a warning if there is an error validating rule with a nullable value', function () {
      var fieldData = createFieldData({
        validation: ['test', 'nullable']
      });
      var ruleMock = mockRule('test');
      ruleMock.mockImplementation(function () {
        throw new Error();
      });
      expect(validateField(fieldData)).toEqual({
        errors: ['test']
      });
      expect(console.warn).toHaveBeenCalled();
      expect(ruleMock).toHaveBeenCalled();
      restoreMocks();
    });
  });
});