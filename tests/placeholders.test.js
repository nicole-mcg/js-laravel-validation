import { generateMessage, PLACEHOLDER_REGEX, DEFAULT_PLACEHOLDERS } from '../src/placeholders';
import * as Messages from '../src/messages';

const oldGetMessage = Messages.getMessage;

describe('Placeholders', () => {
    const testRule = "foo";
    const testRuleParams = [];
    const testMessage = "hello :dog what's up with :cat";
    const getMessage = jest.fn().mockReturnValue(testMessage);

    beforeAll(() => {
        Messages.getMessage = getMessage;
    });

    afterAll(() => {
        Messages.getMessage = oldGetMessage;
    })

    it("can generate a message", () => {
        const dog = "Suzy";
        const cat = "Reginald";
        const fieldData = { dog, cat };

        const message = generateMessage(testRule, testRuleParams, fieldData);

        expect(message).toEqual("hello Suzy what's up with Reginald");
        expect(getMessage).toHaveBeenCalledWith(testRule, fieldData);
    });

    it("will remove non-existant placeholders", () => {
        const dog = "Suzy";
        const fieldData = { dog };

        const message = generateMessage(testRule, testRuleParams, fieldData);

        expect(message).toEqual("hello Suzy what's up with ");
        expect(getMessage).toHaveBeenCalledWith(testRule, fieldData);
    });

    it("will remove non-existant placeholders", () => {
        const dog = "Suzy";
        const fieldData = { dog };

        const message = generateMessage(testRule, testRuleParams, fieldData);

        expect(message).toEqual("hello Suzy what's up with ");
        expect(getMessage).toHaveBeenCalledWith(testRule, fieldData);
    });

    describe("Default placeholders", () => {

        beforeAll(() => {
            Messages.getMessage = oldGetMessage;
        })

        const messageRules = Object.keys(Messages.messages);
        const params = [1, 2, 3, 4, 5];
        messageRules.forEach((rule) => {
            it(`will replace placeholders in message for ${rule} rule`, () => {
                const fieldData = { name: "some field", params };
                const message = generateMessage(rule, testRuleParams, fieldData);

                const placeholders = [];
                let placeholderMatch = message.match(PLACEHOLDER_REGEX);
                while(placeholderMatch) {
                    placeholders.push(placeholderMatch[1]);
                    placeholderMatch = message.match(PLACEHOLDER_REGEX);
                }

                const expectedMessage = placeholders.reduce((message, placeholder) => {
                    const placeholderValue = DEFAULT_PLACEHOLDERS[rule][placeholder](fieldData);
                    return message.split(`:${placeholder}`).join(placeholderValue);
                }, message)

                expect(message).toEqual(expectedMessage);
            });
        });
    });

});
