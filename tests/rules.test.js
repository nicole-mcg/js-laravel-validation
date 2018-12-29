import rules from '../src/rules';

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
                    nullable=false,
                } = test;
                if (values !== undefined) ruleParams.values = values;
                if (value !== undefined) ruleParams.value = value;
                if (params !== undefined) ruleParams.params = params;
                ruleParams.nullable = nullable;
                const testName = `can ${result ? 'allow' : 'deny'} a ${desc}`;
                const testFunc = () => {
                    if (result === undefined) {
                        expect('You must specify a result').toBe(false);
                    }
                    const realResult = rules[rule](ruleParams);
                    if (realResult != result) {
                        expect(test).toBe(`Rule test failed: result=${result} realResult=${realResult}`);
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
    const createNotEmptyTests = ({ isZeroEmpty=false, isFalseEmpty=true }={}) => [
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
            desc: 'value of zero',
            value: 0,
            result: !isZeroEmpty,
        },
        {
            desc: 'null',
            value: null,
            result: false,
        },
        {
            desc: 'boolean (false)',
            value: false,
            result: !isFalseEmpty,
        },
    ];

    createRuleTests('accepted', createNotEmptyTests({ isZeroEmpty: true }));

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
        },
        {
            desc: 'null value',
            value: null,
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
        },
        {
            desc: 'null value',
            value: null,
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
        {
            desc: 'null value',
            value: null,
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
        {
            desc: 'null value',
            value: null,
            result: false,
        }
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
            desc: 'valid value (zero)',
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
        {
            desc: 'null value',
            value: null,
            params: [-1, 1],
            result: false,
        }
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
        },
        {
            desc: 'null value',
            value: null,
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
            desc: 'confirmed null value',
            ruleParams: {
                value: null,
                key: "test",
                values: {
                    test_confirmed: null,
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
            desc: 'valid date object',
            value: new Date('09/17/2018'),
            result: true,
        },
        {
            desc: 'number',
            value: 0,
            result: false,
        },
        {
            desc: 'string',
            value: "whatup",
            result: false,
        },
        {
            desc: 'null value',
            value: null,
            result: false,
        },
        {
            desc: 'boolean value',
            value: false,
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
        },
        {
            desc: 'null date',
            value: null,
            params: [ null ],
            result: false,
        },
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
            desc: 'different value (0 and false)',
            value: 0,
            params: ['test'],
            values: {
                test: false,
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
            desc: 'different value (null and undefined)',
            value: null,
            params: ['test'],
            values: {},
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
        {
            desc: 'same value (null)',
            value: null,
            params: ['test'],
            values: { test: null },
            result: false,
        },
        {
            desc: 'same value (undefined)',
            params: ['test'],
            values: {},
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
        },
        {
            desc: 'null value',
            value: null,
            result: false,
        }
    ]);

    createRuleTests('digits_between', [
        {
            desc: 'value with correct # of digits',
            value: 123,
            params: [2, 4],
            result: true,
        },
        {
            desc: 'number string',
            value: 123,
            params: ["2", "4"],
            result: true,
        },
        {
            desc: 'value with less digits',
            value: 23,
            params: [2, 4],
            result: false,
        },
        {
            desc: 'value with more digits',
            value: 2345,
            params: [2, 4],
            result: false,
        },
        {
            desc: 'null value',
            value: null,
            result: false,
        }
    ]);

    createRuleTests('dimensions', [
        {
            desc: 'valid width',
            value: { width: 100 },
            params: ['width=100'],
            result: true,
        },
        {
            desc: 'valid width (min, max)',
            value: { width: 150 },
            params: ['min_width=100', 'max_width=200'],
            result: true,
        },
        {
            desc: 'valid min width',
            value: { width: 100 },
            params: ['min_width=100'],
            result: true,
        },
        {
            desc: 'valid max width',
            value: { width: 100 },
            params: ['max_width=100'],
            result: true,
        },
        {
            desc: 'valid height',
            value: { height: 100 },
            params: ['height=100'],
            result: true,
        },
        {
            desc: 'valid min height',
            value: { height: 100 },
            params: ['min_height=100'],
            result: true,
        },
        {
            desc: 'valid max height',
            value: { height: 100 },
            params: ['max_height=100'],
            result: true,
        },
        {
            desc: 'invalid width (more)',
            value: { width: 101 },
            params: ['width=100'],
            result: false,
        },
        {
            desc: 'invalid width (less)',
            value: { width: 99 },
            params: ['width=100'],
            result: false,
        },
        {
            desc: 'invalid width (min, max) (more)',
            value: { width: 201 },
            params: ['min_width=100', 'max_width=200'],
            result: false,
        },
        {
            desc: 'invalid width (min, max) (less)',
            value: { width: 99 },
            params: ['min_width=100', 'max_width=200'],
            result: false,
        },
        {
            desc: 'invalid min width',
            value: { width: 99 },
            params: ['min_width=100'],
            result: false,
        },
        {
            desc: 'invalid max width',
            value: { width: 101 },
            params: ['max_width=100'],
            result: false,
        },
        {
            desc: 'invalid height (more)',
            value: { height: 101 },
            params: ['height=100'],
            result: false,
        },
        {
            desc: 'invalid height (less)',
            value: { height: 99 },
            params: ['height=100'],
            result: false,
        },
        {
            desc: 'invalid min height',
            value: { height: 99 },
            params: ['min_height=100'],
            result: false,
        },
        {
            desc: 'invalid max height',
            value: { height: 101 },
            params: ['max_height=100'],
            result: false,
        },
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
            desc: 'distinct null value',
            ruleParams: {
                value: null,
                values: {
                    x: { x: 0 },
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
                value: { x: 0 },
                values: {
                    x: { x: 0 },
                    y: 'hi',
                    z: { x: 0 },
                }
            },
            result: false,
        },
        {
            desc: 'indistinct null value',
            ruleParams: {
                value: null,
                values: {
                    x: null,
                    y: null,
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
        {
            desc: 'null value',
            value: null,
            result: false,
        },
    ]);

    createRuleTests('file', [
        {
            desc: 'file',
            value: new File([], 'test'),
            result: true,
        },
        {
            desc: 'bool',
            value: true,
            result: false,
        },
        {
            desc: 'object',
            value: {},
            result: false,
        },
        {
            desc: 'null value',
            value: null,
            result: false,
        },
    ])

    createRuleTests('filled', createNotEmptyTests({ isFalseEmpty: false }));

    createRuleTests('gt', [
        {
            desc: 'greater string',
            value: "1",
            params: ['test'],
            values: {
                test: "0",
            },
            result: true,
        },
        {// Because this shouldn't be a 'required' rule
            desc: 'undefined field',
            params: ['test'],
            value: 1,
            values: {},
            result: true,
        },
        {
            desc: 'null field',
            params: ['test'],
            value: 1,
            values: { test: null },
            result: true,
        },
        {
            desc: 'lesser number',
            value: 0,
            params: ['test'],
            values: {
                test: 1,
            },
            result: false,
        },
        {
            desc: 'equal number',
            value: 0,
            params: ['test'],
            values: {
                test: 0,
            },
            result: false,
        },
    ]);

    createRuleTests('gte', [
        {
            desc: 'greater string',
            value: "1",
            params: ['test'],
            values: {
                test: "0",
            },
            result: true,
        },
        {
            desc: 'equal number',
            value: 0,
            params: ['test'],
            values: {
                test: 0,
            },
            result: true,
        },
        {// Because this shouldn't be a 'required' rule
            desc: 'undefined field',
            params: ['test'],
            value: 1,
            values: {},
            result: true,
        },
        {
            desc: 'null field',
            params: ['test'],
            value: 1,
            values: { test: null },
            result: true,
        },
        {
            desc: 'lesser number',
            value: 0,
            params: ['test'],
            values: {
                test: 1,
            },
            result: false,
        },
    ]);

    createRuleTests('image', [
        {
            desc: "image",
            value: new Image(),
            result: true,
        },
        {
            desc: "object",
            value: {},
            result: false,
        },
        {
            desc: 'null value',
            value: null,
            result: false,
        },
    ]);

    createRuleTests('in', [
        {
            desc: 'number that is in specified values',
            value: 0,
            params: [1, 0, 2, 4],
            result: true,
        },
        {
            desc: 'null value that is in specified values',
            value: null,
            params: [null],
            result: true,
        },
        {
            desc: 'object that is in specified values',
            value: { x: 0 },
            params: [1, { x: 0 }, 2, 4],
            result: true,
        },
        {
            desc: 'number that is not in specified values',
            value: 0,
            params: [1, 2, 3, 4],
            result: false,
        },
    ]);

    createRuleTests('in_array', [
        {
            desc: 'number that is in specified values',
            value: 0,
            values: { test: [0] },
            params: ['test'],
            result: true,
        },
        {
            desc: 'object that is in specified values',
            value: { x: 0 },
            values: { test: [{ x: 0 }] },
            params: ['test'],
            result: true,
        },
        {
            desc: 'null value that is in specified values',
            value: null,
            values: { test: [null] },
            params: ['test'],
            result: true,
        },
        {
            desc: 'number that is not in specified values',
            value: 0,
            values: { test: [1, 2, 3] },
            params: ['test'],
            result: false,
        },
        {
            desc: 'param that is not an array (null)',
            value: 0,
            values: { test: null },
            params: ['test'],
            result: false,
        }
    ])

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
            desc: 'value of zero',
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
        },
        {
            desc: 'null value',
            value: null,
            result: false,
        },
    ]);

    createRuleTests('ip', [
        {
            desc: 'valid ipv4',
            value: "10.255.255.255",
            result: true,
        },
        {
            desc: 'valid ipv6',
            value: "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
            result: true,
        },
        {
            desc: 'invalid ip',
            value: "10.255.255.2555",
            result: false,
        },
        {
            desc: 'null value',
            value: null,
            result: false,
        },
    ])

    createRuleTests('ipv4', [
        {
            desc: 'valid ipv4',
            value: "10.255.255.255",
            result: true,
        },
        {
            desc: 'invalid ipv4',
            value: "10.255.255.2555",
            result: false,
        },
        {
            desc: 'null value',
            value: null,
            result: false,
        },
    ]);

    createRuleTests('ipv6', [
        {
            desc: 'valid ipv6',
            value: "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
            result: true,
        },
        {
            desc: 'invalid ipv6',
            value: "10.255.255.255",
            result: false,
        },
        {
            desc: 'null value',
            value: null,
            result: false,
        },
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
        {
            desc: 'null value',
            value: null,
            result: false,
        },
    ]);

    createRuleTests('lt', [
        {
            desc: 'lesser string',
            value: "0",
            params: ['test'],
            values: {
                test: "1",
            },
            result: true,
        },
        {
            desc: 'greater number',
            value: 1,
            params: ['test'],
            values: {
                test: 0,
            },
            result: false,
        },
        {
            desc: 'equal number',
            value: 0,
            params: ['test'],
            values: {
                test: 0,
            },
            result: false,
        },
        {//Because this shouldn't be a 'required' field
            desc: 'undefined field',
            params: ['test'],
            value: 1,
            values: {},
            result: false,
        },
    ]);

    createRuleTests('lte', [
        {
            desc: 'lesser string',
            value: "0",
            params: ['test'],
            values: {
                test: "1",
            },
            result: true,
        },
        {
            desc: 'equal number',
            value: 0,
            params: ['test'],
            values: {
                test: 0,
            },
            result: true,
        },
        {
            desc: 'greater number',
            value: 1,
            params: ['test'],
            values: {
                test: 0,
            },
            result: false,
        },
        {
            desc: 'undefined field',
            params: ['test'],
            value: 1,
            values: {},
            result: false,
        },
    ]);

    createRuleTests('max', [
        {
            desc: 'smaller value',
            value: 0,
            params: [1],
            result: true,
        },
        {
            desc: 'equal value',
            value: 1,
            params: [1],
            result: true,
        },
        {
            desc: 'larger value',
            value: 1,
            params: [0],
            result: false,
        },
        {
            desc: 'null value',
            value: null,
            result: false,
        },
    ]);

    createRuleTests('mimetypes', [ // File.type should be correct mime type
        {
            desc: 'matching type',
            value: { type: 'test' },
            params: ['test'],
            result: true,
        },
        {
            desc: 'matching type (2nd param)',
            value: { type: 'test' },
            params: [null, 'test'],
            result: true,
        },
        {
            desc: 'not matching type',
            value: { type: 'test' },
            params: [null],
            result: false,
        },
        {
            desc: 'null value',
            value: null,
            result: false,
        },
    ]);

    createRuleTests('mimes', [ // File.type should be correct mime type
        {
            desc: 'matching type (html)',
            value: { type: 'text/html' },
            params: ['html'],
            result: true,
        },
        {
            desc: 'matching type (htm)',
            value: { type: 'text/html' },
            params: ['html'],
            result: true,
        },
        {
            desc: 'matching type (html as 2nd param)',
            value: { type: 'text/html' },
            params: ['png', 'html'],
            result: true,
        },
        {
            desc: 'not matching type',
            value: { type: '' },
            params: ['html'],
            result: false,
        },
        {
            desc: 'null value',
            value: null,
            result: false,
        },
    ]);

    createRuleTests('min', [
        {
            desc: 'larger value',
            value: 1,
            params: [0],
            result: true,
        },
        {
            desc: 'equal value',
            value: 1,
            params: [1],
            result: true,
        },
        {
            desc: 'smaller value',
            value: 0,
            params: [1],
            result: false,
        },
        {
            desc: 'null value',
            value: null,
            result: false,
        },
    ]);

    createRuleTests('not_in', [
        {
            desc: 'number that is not in specified values',
            value: 0,
            params: [1, 2],
            result: true,
        },
        {
            desc: 'object that is in specified values',
            value: { x: 0 },
            params: [1, { x: 0 }],
            result: false,
        },
        {
            desc: 'number that is in specified values',
            value: 0,
            params: [1, 0],
            result: false,
        },
        {
            desc: 'null value that is in specified values',
            value: null,
            params: [1, null],
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
            result: false
        },
        {
            desc: "string float",
            value: "1.1",
            result: false,
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
        {
            desc: 'null value',
            value: null,
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

    createRuleTests('required', createNotEmptyTests({ isFalseEmpty: false }));

    createRuleTests('required_if', [
        {
            desc: 'filled required value',
            value: 1,
            params: ['test', 2],
            values: { test: 2 },
            result: true,
        },
        {
            desc: 'required value (zero)',
            value: 0,
            params: ['test', 2],
            values: { test: 2 },
            result: true,
        },
        {
            desc: 'filled unrequired value',
            value: 1,
            params: ['test', 2],
            values: { test: 1 },
            result: true,
        },
        {
            desc: 'empty unrequired value',
            value: null,
            params: ['test', 2],
            values: { test: 1 },
            result: true,
        },
        {
            desc: 'empty required value',
            value: null,
            params: ['test', 2],
            values: { test: 2 },
            result: false,
        }
    ]);

    createRuleTests('required_unless', [
        {
            desc: 'filled required value',
            value: 1,
            params: ['test', 2],
            values: { test: 0 },
            result: true,
        },
        {
            desc: 'required value (zero)',
            value: 0,
            params: ['test', 2],
            values: { test: 1},
            result: true,
        },
        {
            desc: 'filled unrequired value',
            value: 1,
            params: ['test', 2],
            values: { test: 2 },
            result: true,
        },
        {
            desc: 'empty unrequired value',
            value: null,
            params: ['test', 2],
            values: { test: 2 },
            result: true,
        },
        {
            desc: 'empty required value',
            value: null,
            params: ['test', 2],
            values: { test: 1 },
            result: false,
        }
    ]);

    createRuleTests('required_with', [
        {
            desc: 'filled required value',
            value: 1,
            params: ['test'],
            values: { test: 1 },
            result: true,
        },
        {
            desc: 'filled required value (zero) ',
            value: 0,
            params: ['test'],
            values: { test: 1 },
            result: true,
        },
        {
            desc: 'empty unrequired value',
            value: null,
            params: ['test'],
            values: { test: null },
            result: true,
        },
        {
            desc: 'filled required value (2 params)',
            value: 1,
            params: ['test', 'test2'],
            values: { test: null, test2: 1 },
            result: true,
        },
        {
            desc: 'filled unrequired value',
            value: 1,
            params: ['test'],
            values: { test: null },
            result: true,
        },
        {
            desc: 'empty required value',
            value: null,
            params: ['test'],
            values: { test: 1 },
            result: false,
        }
    ]);

    createRuleTests('required_with_all', [
        {
            desc: 'filled required value',
            value: 1,
            params: ['test', 'test2'],
            values: { test: 1, test2: 1 },
            result: true,
        },
        {
            desc: 'filled required value (zero)',
            value: 0,
            params: ['test', 'test2'],
            values: { test: 1, test2: 1 },
            result: true,
        },
        {
            desc: 'empty unrequired value',
            value: null,
            params: ['test', 'test2'],
            values: { test: 1, test2: null },
            result: true,
        },
        {
            desc: 'filled unrequired value',
            value: 1,
            params: ['test'],
            values: { test: null },
            result: true,
        },
        {
            desc: 'empty required value',
            value: null,
            params: ['test', 'test2'],
            values: { test: 1, test2: 1 },
            result: false,
        }
    ]);

    createRuleTests('required_without', [
        {
            desc: 'filled required value',
            value: 1,
            params: ['test'],
            values: { test: null },
            result: true,
        },
        {
            desc: 'filled required value (zero)',
            value: 0,
            params: ['test'],
            values: { test: null },
            result: true,
        },
        {
            desc: 'empty unrequired value',
            value: null,
            params: ['test'],
            values: { test: 1 },
            result: true,
        },
        {
            desc: 'filled required value (2 params)',
            value: 1,
            params: ['test', 'test2'],
            values: { test: null, test2: 1 },
            result: true,
        },
        {
            desc: 'filled unrequired value',
            value: 1,
            params: ['test', 'test2'],
            values: { test: 1, test2: 1 },
            result: true,
        },
        {
            desc: 'empty required value',
            value: null,
            params: ['test', 'test2'],
            values: { test: null, test2: 1 },
            result: false,
        }
    ]);

    createRuleTests('required_without_all', [
        {
            desc: 'filled required value',
            value: 1,
            params: ['test', 'test2'],
            values: { test: null, test2: null },
            result: true,
        },
        {
            desc: 'filled required value (zero)',
            value: 0,
            params: ['test', 'test2'],
            values: { test: null, test2: null },
            result: true,
        },
        {
            desc: 'empty unrequired value',
            value: null,
            params: ['test', 'test2'],
            values: { test: 1, test2: 1 },
            result: true,
        },
        {
            desc: 'filled unrequired value',
            value: 1,
            params: ['test'],
            values: { test: 1 },
            result: true,
        },
        {
            desc: 'empty required value',
            value: null,
            params: ['test', 'test2'],
            values: { test: null, test2: null },
            result: false,
        }
    ]);

    createRuleTests('same', [
        {
            desc: 'same number',
            value: 1,
            params: ['test'],
            values: {
                test: 1,
            },
            result: true,
        },
        {
            desc: 'value that is the same but is a string',
            value: "1",
            params: ['test'],
            values: {
                test: 1,
            },
            result: false,
        },
        {
            desc: 'different number',
            value: 2,
            params: ['test'],
            values: {
                test: 1,
            },
            result: false,
        },
    ])

    createRuleTests('size', [
        {
            desc: 'valid number',
            value: 2,
            params: [2],
            result: true,
        },
        {
            desc: 'valid string',
            value: "2",
            params: [1],
            result: true,
        },
        {
            desc: 'string param',
            value: 0,
            params: ["0"],
            result: true,
        },
        {
            desc: 'invalid number',
            value: 0,
            params: [1],
            result: false,
        },
        {
            desc: 'null value',
            value: null,
            params: [1],
            result: false,
        },
    ])

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
        },
        {
            desc: 'null value',
            value: null,
            result: false,
        },
    ]);

    createRuleTests('url', [
        {
            desc: 'valid http url',
            value: 'http://google.ca',
            result: true,
        },
        {
            desc: 'valid https url',
            value: 'https://google.ca',
            result: true,
        },
        {
            skip: true,
            desc: 'url with port',
            value: 'http:google.ca:8000',
            result: true,
        },
        {
            desc: 'url with no protocol',
            value: 'google.ca',
            result: false,
        },
        {
            desc: 'null value',
            value: null,
            result: false,
        },
    ]);

    createRuleTests('uuid', [
        {
            desc: 'valid UUID v1',
            value: "719f6806-e5d3-11e8-9f32-f2801f1b9fd1",
            result: true,
        },
        {
            desc: 'valid UUID v3',
            value: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
            result: true,
        },
        {
            desc: 'valid UUID v4',
            value: '9d8d5851-1921-4a34-8e73-ef95f328c536',
            result: true,
        },
        {
            desc: 'valid UUID v5',
            value: 'a6edc906-2f9f-5fb2-a373-efac406f0ef2',
            result: true,
        },
        {
            desc: 'UUID that is too long',
            value: 'aiedc906-2f9f-5fb2-a373-efac406f0ef28',
            result: false,
        },
        {
            desc: 'UUID that is too short',
            value: 'a6ed906-2f9f-5fb2-a373-efac406f0ef2',
            result: false,
        },
        {
            desc: 'null value',
            value: null,
            result: false,
        },
    ]);

    createRuleTests('timezone', [
        {
            desc: 'valid timezone',
            value: "America/New_York",
            result: true,
        },
        {
            desc: 'invalid timezone',
            value: "Canada/Ontario",
            result: false,
        },
        {
            desc: 'null value',
            value: null,
            result: false,
        },
    ]);

});
