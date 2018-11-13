# JS-Laravel-validation

All rules are base on documentation from https://laravel.com/docs/5.7/validation#available-validation-rules



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
    //handle errors
  }
```

## API

| Function Name  | Description |
| ------------- | ------------- |
| validateForm(options)  | Takes a number of options to validate the specified form data  |
| getMessage(rule, fieldData)  | Gets an error message for the specified rule and field data  |
| setMessageHandler(rule, createMessage)  | Sets or replaces the current message handler for the specified rule |
| setMessageHandlers(messages)  | Replaces multiple message handers  |
| getMessageHandler(rule)  | Returns the current message handler function for the specified rule  |

Function documentation to come

## Missing Rules
- active_url 
  - This cannot be supported because JS does not support hostname lookups (dns_get_record in PHP)
  - This could be implemented if there was a reliable way to host a small API to do the lookup
- date_format
- dimensions
- mimetypes
- mime
- not_regex
- regex
 
