
/** global: jest */
import { validate } from '../src/index'
import RULES from '../src/rules'
import { setMessageHandler, setMessageHandlers, getMessageHandler } from '../src/messages'
import { generateMessage } from '../src/placeholders'

const { validateField, validateForm, parseRule } = validate;

const oldRules = Object.assign({}, RULES);

describe('Custom messages', () => {

    it('can override an existing message', () => {
        setMessageHandler('test', () => 'hey!');

        expect(getMessageHandler('test')).toBeTruthy();
        expect(generateMessage('test')).toEqual('hey!')
    });

    it('can override existing messages', () => {
        setMessageHandlers({
            test: () => 'hey!',
            test2: () => 'hello',
        });

        expect(getMessageHandler('test')).toBeTruthy();
        expect(generateMessage('test')).toEqual('hey!');
        expect(getMessageHandler('test2')).toBeTruthy();
        expect(generateMessage('test2')).toEqual('hello')
    });

})

describe('Form Validator', () => {

    

    describe('validateForm', () => {
        it('can pass field data to validateField', () => {
            const formData = {
                test: {
                    value: 1,
                    validation: 'required',
                }
            }

            const validateField = mockValidateField({});

            validateForm({ formData} );
            expect(validateField).toHaveBeenCalledWith({
                key: 'test',
                value: 1,
                validation: ['required'],
            }, formData)

            restoreMocks();
        });

        it('can return an error', () => {
            const formData = {
                test: {
                    validation: 'required',
                }
            }

            const validateField = mockValidateField({
                errors: [ { key: 'required' } ]
            });

            expect(validateForm({ formData, includeMessages: false } )).toEqual({
                errors: {
                    test: ['required'],
                }
            });
            expect(validateField).toHaveBeenCalled();

            restoreMocks();
        });

        it('can return an error with a message', () => {
            const formData = {
                test: {
                    value: "testVal",
                    validation: 'testRule',
                    customProp: 1,
                }
            }

            const validateField = mockValidateField({
                errors: [ { key: 'testRule' } ]
            });

            const messageMock = mockMessage('testRule', 'hello');

            expect(validateForm({ formData, includeMessages: true } )).toEqual({
                errors: {
                    test: ['hello'],
                }
            })

            expect(validateField).toHaveBeenCalled();
            expect(messageMock).toHaveBeenCalledWith({
                key: 'test',
                validation: ['testRule'],
                value: 'testVal',
                customProp: 1,
            });

            restoreMocks();
        });

        it('can bail on first error', () => {
            const formData = {
                test: {
                    value: null,
                    validation: 'required',
                },
                test2: {
                    value: null,
                    validation: 'required|bail',
                }
            }

            const validateField = mockValidateField();
            validateField.mockReturnValueOnce({
                errors: [ { key: 'required' } ],
            });
            validateField.mockReturnValueOnce({
                errors: [ { key: 'required' } ],
            });

            expect(validateForm({ formData, includeMessages: false } )).toEqual({
                errors: {
                    test: ['required'],
                }
            })

            restoreMocks();
        });

        it('will only give an error for first field error on bail', () => {
            const formData = {
                test: {
                    value: null,
                    validation: 'required|string|bail',
                },
            }

            const validateField = mockValidateField();
            validateField.mockReturnValueOnce({
                errors: [ { key: 'required' }, { key: 'string' } ],
            });

            expect(validateForm({ formData, includeMessages: false } )).toEqual({
                errors: {
                    test: ['required'],
                }
            })

            restoreMocks();
        });
    });

    describe('parseRule', () => {

        it('can parse a rule with no params', () => {
            expect(parseRule('test')).toEqual({
                key: 'test',
                params: [],
            })
        })

        it('can parse a rule with one param', () => {
            expect(parseRule('test:0')).toEqual({
                key: 'test',
                params: ["0"],
            })
        })

        it('can parse a rule with two params', () => {
            expect(parseRule('test:0,1')).toEqual({
                key: 'test',
                params: ["0", "1"],
            })
        })

    })

    describe('validateField', () => {
        

        const oldWarn = console.warn;

        beforeEach(() => {
            console.warn = jest.fn();
        })

        afterEach(() => {
            console.warn = oldWarn;
        })

        it('can allow a field with no rules', () => {
            const fieldData = createFieldData({ value: "hey", validation: ['required'] })

            expect(validateField(fieldData)).toEqual({ errors: false });
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('can allow a validated field', () => {
            const fieldData = createFieldData({ value: "hey", validation: ['required'] })

            expect(validateField(fieldData)).toEqual({ errors: false });
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('can allow a field with no rules', () => {
            const fieldData = createFieldData({ value: "hey", validation: ['required']  })

            expect(validateField(fieldData)).toEqual({ errors: false });
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('can allow a nullable field', () => {
            const fieldData = createFieldData({
                value: null,
                validation: ['test', 'nullable'],
            });

            const ruleMock = mockRule('test', false);

            expect(validateField(fieldData)).toEqual({ errors: false });
            expect(console.warn).not.toHaveBeenCalled();

            expect(ruleMock).toHaveBeenCalled();
            restoreMocks();
        })

        it('can detect an invalid field', () => {
            const result = validateField(createFieldData({ validation: ['required'] }))

            expect(result.errors).toEqual([ { key: 'required', params: [] } ]);
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('can detect multiple rules on one field', () => {
            const result = validateField(createFieldData({ validation: ['required', 'string'] }))

            expect(result.errors).toEqual([ { key: 'required', params: [] }, { key: 'string', params: [] }]);
            expect(console.warn).not.toHaveBeenCalled();
        })

        it('will throw a warning if there is an unknown rule', () => {

            const fieldData = createFieldData({ validation: ['unknown'] })

            expect(validateField(fieldData)).toEqual({ errors: false });
            expect(console.warn).toHaveBeenCalled();

        });

        it('will throw a warning if a nullable field has an unknown rule', () => {

            const fieldData = createFieldData({ validation: ['unknown', 'nullable'] })

            expect(validateField(fieldData)).toEqual({ errors: false });
            expect(console.warn).toHaveBeenCalled();

        });

        it('will throw a warning if there is an error validating rule', () => {

            const fieldData = createFieldData({ validation: ['testRule'] })

            const ruleMock = mockRule('testRule');
            ruleMock.mockImplementation(() => {
                throw new Error();
            });

            expect(validateField(fieldData)).toEqual({ errors: [ { key: 'testRule', params: [] } ] });
            expect(console.warn).toHaveBeenCalled();
            expect(ruleMock).toHaveBeenCalled();

            restoreMocks();
        });

        it('will throw a warning if there is an error validating rule with a nullable value', () => {

            const fieldData = createFieldData({ validation: ['test', 'nullable'] })

            const ruleMock = mockRule('test');
            ruleMock.mockImplementation(() => {
                throw new Error();
            });

            expect(validateField(fieldData)).toEqual({ errors: [ { key: 'test', params: [] } ] });
            expect(console.warn).toHaveBeenCalled();
            expect(ruleMock).toHaveBeenCalled();

            restoreMocks();
        });

    })

})

function createFieldData({ key="test", value, validation}={}) {
    return { key, value, validation };
}

var mockedRules = [];
var mockedMessages = {};
function mockValidateField(returnVal) {
    const mock = jest.fn();
    mock.mockReturnValue(returnVal);
    validate.validateField = mock;
    return mock;
}

function mockRule(name, returnVal) {
    const mock = jest.fn();
    mock.mockReturnValue(returnVal);
    RULES[name] = mock;
    mockedRules.push(name);
    return mock;
}

function mockMessage(rule, returnVal) {
    const mock = jest.fn();
    mock.mockReturnValue(returnVal);
    mockedMessages[rule] = getMessageHandler(rule);
    setMessageHandler(rule, mock);
    return mock;
}

function restoreMocks() {
    validate.validateForm = validateForm;
    validate.validateField = validateField;

    mockedRules.forEach(rule => RULES[rule] = oldRules[rule]);
    mockedRules.length = 0;

    Object.keys(mockedMessages).forEach(rule => setMessageHandler(rule, mockedMessages[rule]));
    mockedMessages.length = 0;
}