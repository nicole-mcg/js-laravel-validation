import rules from '../rules'

describe('Rules', () => {

    function createRuleTests(rule, tests) {
        describe(`${rule} rule`, () => {
            tests.forEach(({ desc, ruleParams={}, result, skip=false, value=undefined }) => {
                if (value !== undefined) ruleParams.value = value;
                const testName = `can ${result ? 'allow' : 'deny'} a ${desc}`;
                const testFunc = () => {
                    expect(rules[rule](ruleParams)).toEqual(result)
                }

                if (skip) {
                    xit(testName, testFunc);
                    return;
                }

                it(testName, testFunc);
            })
        });
    }

    // For rules: accepted, filled, required
    const NOT_EMPTY_TESTS = [
        {
            desc: 'boolean (true)',
            value: true,
            result: true,
        },
        {
            desc: 'truthy value',
            value: 1,
            result: true,
        },
        {
            desc: 'falsy value',
            value: 0,
            result: false,
        },
        {
            desc: 'boolean (false)',
            value: false,
            result: false,
        },
    ]

    createRuleTests('accepted', NOT_EMPTY_TESTS);

    createRuleTests('alpha', [
        {
            desc: 'valid value',
            value: 'ff',
            result: true,
        },
        {
            desc: 'number',
            value: 'f4',
            result: false,
        },
        {
            desc: 'symbol',
            value: 'f%',
            result: false,
        }
    ]);

    createRuleTests('array', [
        {
            desc: 'valid value',
            value: [],
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
            value: true,
            result: true,
        },
        {
            desc: 'valid value (false)',
            value: true,
            result: true,
        },
        {
            desc: 'truthy value',
            value: 1,
            result: false,
        },
        {
            desc: 'falsy value',
            value: 0,
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
            value: '09/17/2018',
            result: true,
        },
        {
            desc: 'number (timestamp)',
            value: 0,
            result: true,
        },
        {
            desc: 'valid date object',
            value: new Date('09/17/2018'),
            result: true,
        },
        {
            skip: true,
            desc: 'string',
            value: "whatup",
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
    ]);

    createRuleTests('email', [
        {
            desc: 'valid email',
            value: "test@test.ca",
            result: true,
        },
        {
            desc: 'email with no @ sign',
            value: "test.ca",
            result: false,
        },
        {
            desc: 'email with nothing before @ sign',
            value: "@test.invalid",
            result: false,
        },
        {
            desc: 'email with an invalid website (.invalid)',
            value: "test@test.invalid",
            result: false,
        },
        {
            desc: 'email with an invalid website (no .)',
            value: "test@test",
            result: false,
        },
    ])

    createRuleTests('filled', NOT_EMPTY_TESTS);

    createRuleTests('integer', [
        {
            desc: 'integer',
            value: 1,
            result: true,
        },
        {
            desc: 'string integer',
            value: "1",
            result: true,
        },
        {
            desc: 'zero',
            value: 0,
            result: true,
        },
        {
            desc: 'float',
            value: 1.1,
            result: false,
        },
        {
            desc: 'undefined value',
            result: false,
        }
    ]);

    createRuleTests('json', [
        {
            desc: "valid JSON",
            value: `{
                "test": 1
            }`,
            result: true,
        },
        {
            desc: "invalid JSON",
            value: `{},`,
            result: false,
        },
        {
            desc: "object",
            value: {},
            result: false,
        },
        {
            desc: "string",
            value: "test",
            result: false,
        },
    ]);

    createRuleTests('numeric', [
        {
            desc: "integer",
            value: 1,
            result: true,
        },
        {
            desc: "float",
            value: 1.1,
            result: true,
        },
        {
            desc: "string integer",
            value: "1",
            result: true
        },
        {
            desc: "string float",
            value: "1.1",
            result: true,
        },
        {
            desc: "string",
            value: "test",
            result: false,
        },
        {
            desc: "object",
            value: {},
            result: false,
        },
    ]);

    createRuleTests('present', [
        {
            desc: 'present value',
            value: true,
            result: true,
        },
        {
            desc: 'false',
            value: false,
            result: true,
        },
        {
            desc: 'null',
            value: null,
            result: true,
        },
        {
            desc: 'undefined',
            result: false,
        }
    ]);

    createRuleTests('required', NOT_EMPTY_TESTS);

    createRuleTests('string', [
        {
            desc: 'string',
            value: 'test',
            result: true,
        },
        {
            desc: 'empty string',
            value: "",
            result: true,
        },
        {
            desc: 'boolean',
            value: true,
            result: false,
        },
        {
            desc: 'number',
            value: 1,
            result: false,
        }
    ]);
})