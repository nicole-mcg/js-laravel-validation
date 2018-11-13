# JS-Laravel-validation

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
