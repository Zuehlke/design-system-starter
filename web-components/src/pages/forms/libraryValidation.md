# Custom Validation with Form Libraries

In most cases we want to use powerful form libraries with complex validation logic. In this case we don't want
the default browser form validations. This can be achieved by setting:

```html

<form novalidate>
  ...
</form>
```

In this example here we use the package [yup](https://www.npmjs.com/package/yup) to show complex validation with custom
messages on our form elements.

The current validation configuration of this form is:

```javascript
const schema = yup.object().shape({
  name: yup.string().required('Please add a name.'),
  age: yup.number()
    .typeError('Please enter the age as a number.')
    .required('Please enter the age as a number.')
    .min(16, 'Age must be at least 16.')
    .max(118, 'Age must be below 118.'),
  createdAt: yup.date()
    .transform((value) => {
      if (isNaN(value)) {
        return undefined;
      }
      return value;
    })
    .default(() => new Date()),
  addEmail: yup.string(),
  email: yup.string().when('addEmail', {
    is: 'on',
    then: yup.string().required('Please enter an email address'),
    otherwise: yup.string(),
  }),
});
```
