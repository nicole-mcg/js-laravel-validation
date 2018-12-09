# `setMessageHandler(rule, createMessage)`

Sets or replaces the current message handler for the specified rule.<br>You will get a message created with the handler if `includeMessages` option is true

## Parameters

<table>
  <thead>
    <th>Name</th>
    <th>Description</th>
  </thead>
  <tbody>
    <tr>
      <td>
        rule:string
      </td>
      <td>
        The rule to set the message handler for. E.g <code>"required|image"</code>
      </td>
    </tr>
    <tr>
      <td>
        createMessage:function
      </td>
      <td>
        A function which handles message creation. E.g <code>(rule, fieldData) => `${rule} failed`</code><br>
        Where fieldData will be in the form of:<br>
<pre>{
  key: [fieldName], // The field's key from formData given to validateForm
  validation: [rule], // Directly from formData given to validateForm
  value: [value] // Directly from formData given to validateForm
  ... // Will include any extra properties on field that are given to validateForm. E.g "label" key
}</pre>
      </td>
    </tr>
  </tbody>
</table>
