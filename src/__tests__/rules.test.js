import rules from '../rules'

describe('Rules', () => {

    function createRuleTests(rule, tests) {
        describe(`${rule} rule`, () => {
            tests.forEach(({ desc, ruleParams={}, result }) => {
                const testName = `can ${result ? 'allow' : 'deny'} a ${desc}`
                it(testName, () => {
                    expect(rules[rule](ruleParams)).toEqual(result)
                });
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

})