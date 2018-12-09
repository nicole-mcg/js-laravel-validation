# `validateForm(options)`

## Options

| Option  | Description |
| ------------- | ------------- |
| formData  | The form data to validate. In the form of
```
{
  [fieldName]: {
    value: [value],
    rules: [rules], // E.g "required|image"
  }
}
```
|
| includeMessages  | `errors.field` will be a message instead of rule name  |

## Return value

```
{
  [fieldName]: [rule|message],
  ...
}
```
