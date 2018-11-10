# JS-Laravel-validation

### Usage

Currently no dist is provided so this may change

```
  import { validateForm } from 'js-laravel-validation'
  
  const formData = {
    username: {
      value: 'test1',
      rules: 'required|string'
    },
    password: {
      value null,
      rules: required|string'
    }
  }
  
  const result = validateForm(formData);
  
  if (result.error) {
    console.log(`invalid field ${result.key} rule=${result.rule}`
  }
```
