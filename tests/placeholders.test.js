import { generateMessage } from '../src/placeholders';
import * as Messages from '../src/messages';

const oldGetMessage = Messages.getMessage;

describe('Placeholders', () => {
    const testRule = "foo";
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

        const message = generateMessage(testRule, fieldData);

        expect(message).toEqual("hello Suzy what's up with Reginald");
        expect(getMessage).toHaveBeenCalledWith(testRule, fieldData);
    });

    it("will remove non-existant placeholders", () => {
        const dog = "Suzy";
        const fieldData = { dog };

        const message = generateMessage(testRule, fieldData);

        expect(message).toEqual("hello Suzy what's up with ");
        expect(getMessage).toHaveBeenCalledWith(testRule, fieldData);
    });

});
