
import { validateForm } from '../index.js'

describe('Form Validator', () => {

    const oldWarn = console.warn;
    console.warn = jest.fn();

    it('can allow a validated field', () => {
        const formData = {
            test: {
                value: "hey",
                rules: 'required'
            }
        }

        const result = validateForm(formData)

        expect(result.error).toBeUndefined();
        expect(console.warn).not.toHaveBeenCalled();
    })

    it('can detect an invalid field', () => {
        const formData = {
            test: {
                value: null,
                rules: 'required'
            }
        }

        const result = validateForm(formData)

        expect(result.error).toBe(true);
        expect(console.warn).not.toHaveBeenCalled();
    })

    it('will throw a warning if there is an unknown rule', () => {
        const formData = {
            test: {
                value: null,
                rules: 'unknown'
            }
        }

        const result = validateForm(formData)

        expect(result.error).toBeUndefined();
        expect(console.warn).toHaveBeenCalled();
    })

})