import rules from '../rules';

describe('Rules', () => {

    function createRuleTests(rule, tests) {
        describe(`${rule} rule`, () => {
            tests.forEach((test) => {
                const {
                    desc,
                    ruleParams={},
                    result,
                    skip=false,
                    value=undefined,
                    values=undefined,
                    params=undefined,
                } = test;
                if (values !== undefined) ruleParams.values = values;
                if (value !== undefined) ruleParams.value = value;
                if (params !== undefined) ruleParams.params = params;
                const testName = `can ${result ? 'allow' : 'deny'} a ${desc}`;
                const testFunc = () => {
                    if (result === undefined) {
                        expect('You must specify a result').toBe(false);
                    }
                    const realResult = rules[rule](ruleParams);
                    if (realResult != result) {
                        expect(test).toBe(`Rule test failed:`);
                        //expect(test).toBe(false);
                    }
                    expect(realResult).toEqual(result);
                };

                if (skip) {
                    xit(testName, testFunc);
                    return;
                }

                it(testName, testFunc);
            });
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
    ];

    createRuleTests('accepted', NOT_EMPTY_TESTS);

    createRuleTests('after', [
        {
            desc: 'date after specified date',
            value: new Date('01/20/2018'),
            params: [ new Date('01/15/2018') ],
            result: true,
        },
        {
            desc: 'null param',
            value: new Date('01/20/2018'),
            params: [ null ],
            result: true,
        },
        {
            desc: 'date before specified date',
            value: new Date('01/14/2018'),
            params: [ new Date('01/15/2018') ],
            result: false,
        },
        {
            desc: 'equal date',
            value: new Date('01/20/2018'),
            params: [ new Date('01/20/2018') ],
            result: false,
        },
        {
            desc: 'null value',
            value: null,
            params: [ new Date('01/15/2018') ],
            result: false,
        },
    ]);

    createRuleTests('after_or_equal', [
        {
            desc: 'date after specified date',
            value: new Date('01/20/2018'),
            params: [ new Date('01/15/2018') ],
            result: true,
        },
        {
            desc: 'null param',
            value: new Date('01/20/2018'),
            params: [ null ],
            result: true,
        },
        {
            desc: 'date before specified date',
            value: new Date('01/14/2018'),
            params: [ new Date('01/15/2018') ],
            result: false,
        },
        {
            desc: 'equal date',
            value: new Date('01/20/2018'),
            params: [ new Date('01/20/2018') ],
            result: true,
        },
        {
            desc: 'null value',
            value: null,
            params: [ new Date('01/15/2018') ],
            result: false,
        },
    ]);

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

    createRuleTests('alpha_dash', [
        {
            desc: 'alpha string',
            value: "test",
            result: true,
        },
        {
            desc: 'dashed alpha string',
            value: "test-test",
            result: true,
        },
        {
            desc: 'string with spaces',
            value: "test f",
            result: false,
        },
        {
            desc: 'number string',
            value: "1",
            result: false,
        }
    ]);

    createRuleTests('alpha_num', [
        {
            desc: 'alpha string',
            value: 'test',
            result: true,
        },
        {
            desc: 'number string',
            value: '12',
            result: true,
        },
        {
            desc: 'alnum string',
            value: 'test1test',
            result: true,
        },
        {
            desc: 'string with spaces',
            value: 'test 1',
            result: false,
        },
        {
            desc: 'dashed alnum string',
            value: 'test-1-test',
            result: false,
        },
        {
            desc: 'string with symbols',
            value: '$test4',
            result: false,
        },
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

    // bail: is on by default and can be set in `validateForm` call

    createRuleTests('before', [
        {
            desc: 'date before specified date',
            value: new Date('01/15/2018'),
            params: [ new Date('01/20/2018') ],
            result: true,
        },
        {
            desc: 'null value',
            value: null,
            params: [ new Date('01/15/2018') ],
            result: true,
        },
        {
            desc: 'date after specified date',
            value: new Date('01/25/2018'),
            params: [ new Date('01/20/2018') ],
            result: false,
        },
        {
            desc: 'equal date',
            value: new Date('01/20/2018'),
            params: [ new Date('01/20/2018') ],
            result: false,
        },
        {
            desc: 'null param',
            value: new Date('01/20/2018'),
            params: [ null ],
            result: false,
        },
    ]);

    createRuleTests('before_or_equal', [
        {
            desc: 'date before specified date',
            value: new Date('01/15/2018'),
            params: [ new Date('01/20/2018') ],
            result: true,
        },
        {
            desc: 'equal date',
            value: new Date('01/20/2018'),
            params: [ new Date('01/20/2018') ],
            result: true,
        },
        {
            desc: 'null value',
            value: null,
            params: [ new Date('01/15/2018') ],
            result: true,
        },
        {
            desc: 'date after specified date',
            value: new Date('01/25/2018'),
            params: [ new Date('01/20/2018') ],
            result: false,
        },
        {
            desc: 'null param',
            value: new Date('01/20/2018'),
            params: [ null ],
            result: false,
        },
    ]);

    createRuleTests('between', [
        {
            desc: 'valid value (number)',
            value: 1,
            params: [0, 2],
            result: true,
        },
        {
            desc: 'valid value (string)',
            value: "test",
            params: [3, 5],
            result: true,
        },
        {
            desc: 'low number',
            value: 1,
            params: [2, 4],
            result: false,
        },
        {
            desc: 'long string',
            value: "test",
            params: [1, 2],
            result: false,
        },
    ])

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
    ]);

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

    createRuleTests('date_equals', [
        {
            desc: 'equal date',
            value: new Date('01/20/2018'),
            params: [ new Date('01/20/2018') ],
            result: true,
        },
        {
            desc: 'different date',
            value: new Date('01/21/2018'),
            params: [ new Date('01/20/2018') ],
            result: false,
        }
    ]);

    createRuleTests('different', [
        {
            desc: 'different bool',
            value: true,
            params: ['test'],
            values: {
                test: false,
            },
            result: true,
        },
        {
            desc: 'different object',
            value: { x: 1 },
            params: ['test'],
            values: {
                test: { x: 0 },
            },
            result: true,
        },
        {
            desc: 'same object',
            value: { x: 1 },
            params: ['test'],
            values: {
                test: { x: 1 },
            },
            result: true,
        },
        {
            desc: 'same array',
            value: [1],
            params: ['test'],
            values: {
                test: [1],
            },
            result: true,
        },
        {
            desc: 'same bool',
            value: true,
            params: ['test'],
            values: {
                test: true,
            },
            result: false,
        },
    ]);

    createRuleTests('digits', [
        {
            desc: 'value with correct # of digits',
            value: 123,
            params: [3],
            result: true,
        },
        {
            desc: 'number string',
            value: 123,
            params: ["3"],
            result: true,
        },
        {
            desc: 'value with less digits',
            value: 23,
            params: [3],
            result: false,
        },
        {
            desc: 'value with more digits',
            value: 2345,
            params: [3],
            result: false,
        }
    ])

    createRuleTests('distinct', [
        {
            desc: 'distinct value',
            ruleParams: {
                value: "hey",
                values: {
                    x: 'hey',
                    y: 'hi',
                }
            },
            result: true,
        },
        {
            desc: 'indistinct value',
            ruleParams: {
                value: "hey",
                values: {
                    x: 'hey',
                    y: 'hi',
                    z: "hey",
                }
            },
            result: false,
        },
        {
            desc: 'indistinct object',
            ruleParams: {
                value: "hey",
                values: {
                    x: { x: 0 },
                    y: 'hi',
                    z: { x : 0 },
                }
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
    ]);

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
});