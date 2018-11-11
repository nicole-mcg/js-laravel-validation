import RULES from './rules'

const toExport = {};

// { fieldName: {value, rules} }
function validateForm(formData) {

    const keys = Object.keys(formData);

    let bail = false;

    let errors = {};
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const rules = formData[key].rules.split('|');

        if (rules.includes('bail')) {
            bail = true;
            if (Object.keys(errors).length > 0) {
                break;
            }
        }

        const fieldData = {
            key,
            rules,
            value: formData[key].value,
        };

        const result = toExport.validateField(fieldData, formData);

        if (result.error) {
            errors[key] = {
                rule: result.rule
            }

            if (bail) {
                break;
            }
        }
    }

    return {
        errors: errors == {} ? false : errors,
    }
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

    const rules = fieldData.rules;
    const nullable = rules.includes('nullable');

    for (let i = 0; i < rules.length; i++) {
        let rule;
        try {
            rule = parseRule(rules[i]);
        } catch (e) {
            console.warn(`Invalid rule on field ${fieldData.key} rule=${rules[i]}`);
            continue;
        }

        if (rule.key === 'nullable') {
            continue;
        }

        if (!RULES[rule.key]) {
            console.warn(`Could not find rule on field ${fieldData.key} rule=${rules[i]}`);
            continue;
        }

        //TODO custom handling for 'sometimes' rule

        const params = {
            ...rule,
            value: fieldData.value,
            values,
        }

        let result = false;
        try {
            result = RULES[rule.key](params);
        } catch (e) {
            console.warn(`Error validative rule, most likely invalid params: rule${rule.key} field=${fieldData.key}`)
            continue;
        }

        if (!result) {
            if ((nullable && fieldData.value === null)) {
                continue;
            }
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
toExport.parseRule = parseRule;

exports.validate = toExport;