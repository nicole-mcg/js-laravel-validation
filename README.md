# JS-Laravel-validation

### Usage

Currently no dist is provided

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
  
  const result = validateForm({
    formData,
    includeMessages: true,
  });
  
  if (result.errors) {
    Object.keys(result.errors).forEach(key => {
      const error = result.errors[key];
      console.log(`invalid field field=${key} rules=${error.rules} messages=${error.messages}`
    }
  }
```
