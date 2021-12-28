import {
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormHelperText
} from "@mui/material";
import { Field, FieldProps, getIn } from "formik";
import { Checkbox } from "formik-mui";
import React from "react";

export interface FormControlCheckboxProps {
  label: React.ReactElement;
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
    <div className={props.className}>
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
    </div>
  );
};
