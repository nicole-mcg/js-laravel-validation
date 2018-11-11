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
      const errors = result.errors[key];
      
      errors.forEach(error => {
        console.log(`invalid field field=${key} rule=${error.rule} messages=${error.message}`
      }
    }
  }
```
