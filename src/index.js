import RULES from './rules'

const toExport = {};

// { fieldName: {value, rules} }
function validateForm(formData) {

    const keys = Object.keys(formData);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const fieldData = {
            key,
            value: formData[key].value,
            rules: formData[key].rules,
        };

        const result = toExport.validateField(fieldData, formData);

        if (result.error) {
            return {
                key,
                error: true,
                rule: result.rule,
            }
        }
    }

    return {};
}

function parseRule(rule) {
    const ruleParts = rule.split(':')
    return {
        key: ruleParts[0],
        params: ruleParts[1] ? ruleParts[1].split(',') : [],
    };
}

// {key, value, rules}
function validateField(fieldData, formData) {

    const values = formData && Object.keys(formData).reduce((values, key) => {
        values[key] = formData[key].value;
        return values;
    }, {});

    const rules = fieldData.rules.split('|');

    for (let i = 0; i < rules.length; i++) {
        const rule = parseRule(rules[i]);

        if (!RULES[rule.key]) {
            console.warn(`Invalid rule on field ${fieldData.key} rule=${rule}`);
            continue;
        }

        const params = {
            ...rule,
            value: fieldData.value,
            values,
        }

        if (!RULES[rule.key](params)) {
            return {
                error: true,
                rule: rules[i],
            }
        }
    }

    return {};
}

toExport.validateForm = validateForm;
toExport.validateField = validateField;

exports.validate = toExport;