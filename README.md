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
  
  const result = validateForm(formData);
  
  if (result.errors) {
    Object.keys(result.errors).forEach(key => {
      console.log(`invalid field field=${result.errors[key]} rule=${key}`
    }
  }
```
