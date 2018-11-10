import RULES from './rules'

// { fieldName: {value, rules} }
function validateForm(formData) {

    const keys = Object.keys(formData);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const fieldData = {
            name: key,
            value: formData[key].value,
            rules: formData[key].rules,
        };

        const result = validateField(fieldData, formData);

        if (result.error) {
            return {
                error: true,
                name: key,
                rule: result.rule,
            }
        }
    }

    return {};
}

// {name, value, rules}
function validateField(fieldData, formData) {

    const values = Object.keys(formData).reduce((values, name) => {
        values[name] = formData[name].value;
        return values;
    }, {})
    const rules = fieldData.rules.split('|');

    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];

        if (!RULES[rule]) {
            console.warn(`Invalid rule on field ${fieldData.name} rule=${rule}`);
            continue;
        }

        const ruleParams = {
            value: fieldData.value,
            key: fieldData.name,
            values,
        }

        if (!RULES[rule](ruleParams)) {
            return {
                error: true,
                rule,
                name: fieldData.name,
            }
        }
    }

    return {};
}

exports.validateForm = validateForm;