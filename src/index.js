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

// {key, value, rules}
function validateField(fieldData, formData) {

    const values = formData && Object.keys(formData).reduce((values, key) => {
        values[key] = formData[key].value;
        return values;
    }, {});

    const rules = fieldData.rules.split('|');

    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];

        if (!RULES[rule]) {
            console.warn(`Invalid rule on field ${fieldData.key} rule=${rule}`);
            continue;
        }

        const ruleParams = {
            value: fieldData.value,
            key: fieldData.key,
            values,
        }

        if (!RULES[rule](ruleParams)) {
            return {
                error: true,
                rule,
            }
        }
    }

    return {};
}

toExport.validateForm = validateForm;
toExport.validateField = validateField;

exports.validate = toExport;