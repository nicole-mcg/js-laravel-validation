import rules from '../rules'

describe('Rules', () => {

    function createRuleTests(rule, tests) {
        describe(`${rule} rule`, () => {
            tests.forEach(({ desc, ruleParams={}, result, skip=false }) => {
                const testName = `can ${result ? 'allow' : 'deny'} a ${desc}`;
                const testFunc = () => expect(rules[rule](ruleParams)).toEqual(result);

                if (skip) {
                    xit(testName, testFunc);
                    return;
                }

                it(testName, testFunc);
            })
        });
    }

    createRuleTests('alpha', [
        {
            desc: 'valid value',
            ruleParams: { value: 'ff' },
            result: true,
        },
        {
            desc: 'number',
            ruleParams: { value: 'f4' },
            result: false,
        },
        {
            desc: 'symbol',
            ruleParams: { value: 'f%' },
            result: false,
        }
    ]);

    createRuleTests('array', [
        {
            desc: 'valid value',
            ruleParams: { value: [] },
            result: true,
        },
        {
            desc: 'non-array value',
            result: false,
        },
        {
            name: 'array-like object',
            ruleParams: {value: {
                0: '',
                1: '',
                length: 2,
            }},
            result: false,
        },
    ]);

    createRuleTests('boolean', [
        {
            desc: 'valid value (true)',
            ruleParams: { value: true },
            result: true,
        },
        {
            desc: 'valid value (false)',
            ruleParams: { value: true },
            result: true,
        },
        {
            desc: 'truthy value',
            ruleParams: { value: 1 },
            result: false,
        },
        {
            desc: 'falsy value',
            ruleParams: { value: 0 },
            result: false,
        }
    ]);

    createRuleTests('confirmed', [
        {
            desc: 'confirmed value',
            ruleParams: {
                value: "hey",
                key: "test",
                values: {
                    test_confirmed: "hey",
                },
            },
            result: true,
        },
        {
            desc: "non-confirmed value",
            ruleParams: {
                value: "hey",
                key: "test",
                values: {
                },
            },
            result: false,
        },
        {
            desc: "incorrectly confirmed value",
            ruleParams: {
                value: "hey",
                key: "test",
                values: {
                    test_confirmed: "yo",
                },
            },
            result: false,
        }
    ])

    createRuleTests('date', [
        {
            desc: 'valid date string',
            ruleParams: { value: '09/17/2018' },
            result: true,
        },
        {
            desc: 'number (timestamp)',
            ruleParams: { value: 0 },
            result: true,
        },
        {
            desc: 'valid date object',
            ruleParams: { value: new Date('09/17/2018') },
            result: true,
        },
        {
            skip: true,
            desc: 'string',
            ruleParams: { value: "whatup" },
            result: false,
        }
    ]);

    createRuleTests('distinct', [
        {
            desc: 'distinct value',
            ruleParams: {
                value: "hey",
                values: ['hey', 'hi']
            },
            result: true,
        },
        {
            desc: 'indistinct value',
            ruleParams: {
                value: "hey",
                values: ['hey', 'hi', "hey"]
            },
            result: false,
        },
        {
            desc: 'indistinct object',
            ruleParams: {
                value: "hey",
                values: [{ x: 0 }, 'hi', { x: 0 }]
            },
            result: false,
        }
    ])

})