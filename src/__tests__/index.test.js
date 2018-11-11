
import { validate } from '../index'
import RULES from '../rules'

const { validateField, validateForm, parseRule } = validate;

const oldRules = Object.assign({}, RULES);

describe('Form Validator', () => {

    const mockedRules = [];

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

    function restoreMocks() {
        validate.validateForm = validateForm;
        validate.validateField = validateField;
        mockedRules.forEach(rule => RULES[rule] = oldRules[rule]);
        mockedRules.length = 0;
    }

    describe('validateForm', () => {
        it('can pass field data to validateField', () => {
            const formData = {
                test: {
                    value: 1,
                    rules: 'required',
                }
            }

            const validateField = mockValidateField({});

            validateForm(formData);
            expect(validateField).toHaveBeenCalledWith({
                key: 'test',
                value: 1,
                rules: 'required',
            }, formData)

            restoreMocks();
        })

        it('can return an error', () => {
            const formData = {
                test: {
                    rules: 'required',
                }
            }

            const validateField = mockValidateField({
                error: true,
                key: 'test',
                rule: 'required',
            });

            expect(validateForm(formData)).toEqual({
                errors: {
                    test: {
                        rule: 'required',
                    }
                }
            })

            restoreMocks();
        })
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
        function createFieldData({ key="test", value=null, rules="required" }={}) {
            return { key, value, rules };
        }

        const oldWarn = console.warn;

        beforeEach(() => {
            console.warn = jest.fn();
        })

        afterEach(() => {
            console.warn = oldWarn;
        })

        it('can allow a field with no rules', () => {
            const fieldData = createFieldData({ value: "hey" })

            expect(validateField(fieldData)).toEqual({});
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('can allow a validated field', () => {
            const fieldData = createFieldData({ value: "hey" })



            expect(validateField(fieldData)).toEqual({});
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('can allow a field with no rules', () => {
            const fieldData = createFieldData({ value: "hey" })

            expect(validateField(fieldData)).toEqual({});
            expect(console.warn).not.toHaveBeenCalled();
        })

        it('can detect an invalid field', () => {
            const result = validateField(createFieldData())

            expect(result.error).toBe(true);
            expect(result.rule).toEqual('required');
            expect(console.warn).not.toHaveBeenCalled();
        })

        it('will throw a warning if there is an unknown rule', () => {

            const fieldData = createFieldData({ rules: 'unknown' })

            expect(validateField(fieldData)).toEqual({});
            expect(console.warn).toHaveBeenCalled();

        });

        it('will throw a warning if there is an error validating rule', () => {

            const fieldData = createFieldData({ rules: 'test' })

            const ruleMock = mockRule('test');
            ruleMock.mockImplementation(() => {
                throw new Error();
            });

            expect(validateField(fieldData)).toEqual({});
            expect(console.warn).toHaveBeenCalled();

        })
    })

})