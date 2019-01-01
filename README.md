# js-laravel-validation [![npm version](https://badge.fury.io/js/js-laravel-validation.svg)](https://badge.fury.io/js/js-laravel-validation) [![Build Status](https://travis-ci.org/niknakbakpak/js-laravel-validation.svg?branch=master)](https://travis-ci.org/niknakbakpak/js-laravel-validation)

Useful for having consistent server side and client side validation with Laravel

All rules are base on documentation from https://laravel.com/docs/5.7/validation#available-validation-rules

## Setup

Install: `npm install js-laravel-validation`

## Usage

```javascript
  import { validateForm } from "js-laravel-validation";

  const formData = {
    username: {
      value: "test1",
      validation: "required|string"
    },
    password: {
      value: null,
      validation: "required|string"
    }
  };

  const result = validateForm({ formData });

  if (result.errors) {
    console.log(result.errors); // will be { password: ['required', 'string'] }
  }

```

## API

| Function Name  | Description |
| ------------- | ------------- |
| [validateForm(options)](https://github.com/niknakbakpak/js-laravel-validation/blob/master/docs/validateForm.md)  | Takes a number of options to validate the form data  |
| [setMessageHandler(rule, createMessage)](https://github.com/niknakbakpak/js-laravel-validation/blob/master/docs/setMessageHandler.md)  | Sets or replaces the current message handler for the specified rule |
| [setMessageHandlers(messages)](https://github.com/niknakbakpak/js-laravel-validation/blob/master/docs/setMessageHandlers.md)  | Replaces multiple message handers  |

## Missing Rules
- active_url 
  - This cannot be supported because JS does not support hostname lookups (dns_get_record in PHP)
  - This could be implemented if there was a reliable way to host a small API to do the lookup
- date_format
  - This can be added with something like `return new Date(value).format(params[0]) === value;`
  - Unfortunately that isn't so easy in vanilla js atm

- not_regex (to come)
- regex (to come)
  - Regex requires extra parsing to remove forward slashes around regex
 
