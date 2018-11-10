
import { validateForm, validateField } from '../index.js'

describe('Form Validator', () => {

    const oldWarn = console.warn;
    console.warn = jest.fn();

    function createFieldData({ key="test", value=null, rules="required" }={}) {
        return { key, value, rules };
    }

    it('can allow a validated field', () => {
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
    })

})