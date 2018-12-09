# JS-Laravel-validation [![npm version](https://badge.fury.io/js/js-laravel-validation.svg)](https://badge.fury.io/js/js-laravel-validation) [![Build Status](https://travis-ci.org/c-mcg/JS-Laravel-validation.svg?branch=master)](https://travis-ci.org/c-mcg/JS-Laravel-validation)

All rules are base on documentation from https://laravel.com/docs/5.7/validation#available-validation-rules

 - No dependencies
 - Works in Node.js and browser
 - Works with any front-end framework

## Setup

Install: `npm install js-laravel-validation`

## Usage

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
  
  const result = validateForm({ formData });
  
  if (result.errors) {
    console.log(formData.errors); // will be { password: ['required', 'string'] }
  }
```

## API

| Function Name  | Description |
| ------------- | ------------- |
| [validateForm(options)](https://github.com/c-mcg/js-laravel-validation/blob/master/docs/validateForm.md)  | Takes a number of options to validate the form data  |
| [setMessageHandler(rule, createMessage)](https://github.com/c-mcg/js-laravel-validation/blob/master/docs/setMessage.md)  | Sets or replaces the current message handler for the specified rule |
| setMessageHandlers(messages)  | Replaces multiple message handers  |



Function documentation to come

## Missing Rules
- active_url 
  - This cannot be supported because JS does not support hostname lookups (dns_get_record in PHP)
  - This could be implemented if there was a reliable way to host a small API to do the lookup
- date_format
  - This can be added with something like `return new Date(value).format(params[0]) === value;`
- dimensions
  - This requires named params which could be 
   ```
   pair = params[i].split('=');
   namedParams = { [pair[0]]: pair[1] }
   ```
- mimetypes
- mime
- not_regex
- regex
  - Regex requires extra parsing to remove forward slashes around regex
 
