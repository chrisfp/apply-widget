import {
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormHelperText
} from "@material-ui/core";
import { Field, FieldProps, getIn } from "formik";
import { Checkbox } from "formik-material-ui";
import React from "react";

export interface FormControlCheckboxProps {
  label: React.ReactNode;
}

export const FormControlCheckbox: React.FunctionComponent<FormControlCheckboxProps &
  CheckboxProps &
  FieldProps> = ({
  form: { errors, touched },
  field: { name },
  label,
  ...props
}) => {
  const errorText = getIn(errors, name);
  const touchedVal = getIn(touched, name);
  const hasError = touchedVal && errorText !== undefined;

  return (
    <FormControl error={hasError}>
      <FormControlLabel
        control={
          <Field
            type="checkbox"
            color="primary"
            name={name}
            component={Checkbox}
            {...props}
          />
        }
        label={label}
      />
      {hasError && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl>
  );
};
