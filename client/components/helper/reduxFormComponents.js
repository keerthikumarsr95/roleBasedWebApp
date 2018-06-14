import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';

export const renderCheckBox = ({ input, label }) => (
  <Checkbox
    label={label}
    checked={input.value ? true : false}
    onCheck={input.onChange}
  />
);

export const renderTextField = ({ input, label, hintText, meta: { touched, error }, styles, type }) => {
  return (
    <TextField
      hintText={hintText || label}
      floatingLabelText={label}
      errorText={touched && error}
      type={type ? type : 'text'}
      {...input}
      {...styles}
    />
  )
};

export const renderTextAreaField = ({ input, label, hintText, fullWidth, meta: { touched, error }, styles, type }) => {
  return (
    <TextField
      // hintText={hintText || label}
      fullWidth={fullWidth}
      // floatingLabelText={label}
      errorText={touched && error}
      type={type ? type : 'text'}
      {...input}
      {...styles}
    />
  )
};



export const renderSelectField = ({ input, label, meta: { touched, error }, children, styles }) => (
  <SelectField
    children={children}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...styles}
    onChange={(event, index, value) => input.onChange(value)}
  />
)


