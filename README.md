# JS-Laravel-validation

## Setup

Set custom messages:

```javascript
    import { validate } from 'js-laravel-validation'
    
    validate.setCustomMessage('required', ({ key, value }) => `${key} field is required.`)
```

The parameter to your `createMessage` function will the same field object you supplied in your `formData`. Differences are it will have a `key` prop with the field name, and the `validation` prop will be an array of rules (with parameters if any)

E.g: 

```javascript
    validateForm({ 
        name: {
            value: "c mcg",
            validation: 'required|string',
            label: 'Full Name', //Custom property
        }
    })
```

will call the custom message function with

```javascript
{
    key: 'name',
    validation: ['required', 'string'],
    value: "c mcg",
    label: 'Full Name',
}
```

## Usage

Currently no dist is provided

```javascript
  import { validateForm } from 'js-laravel-validation'
  
  const formData = {
    username: {
      value: 'test1',
      validation: 'required|string'
    },
    password: {
      value null,
      validation: 'required|string'
    }
  }
  
  const result = validateForm({
    formData,
    includeMessages: true,
  });
  
  if (result.errors) {
    Object.keys(result.errors).forEach(key => {
      const errors = result.errors[key];
      
      errors.forEach(error => {
        console.log(`invalid field field=${key} rule=${error.rule} messages=${error.message}`
      }
    }
  }
```
