import "firebase/firestore";

import { DatePickerProps, KeyboardDatePicker } from "@material-ui/pickers";
import { isValid } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import firebase from "firebase/app";
import { FieldProps, getIn } from "formik";
import React from "react";

export const FormikKeyboardDatePicker: React.FunctionComponent<DatePickerProps &
  FieldProps> = ({
  form: { setFieldValue, setFieldError, isSubmitting, errors, touched },
  field: { name, value, onBlur },
  ...props
}) => {
  const errorText = getIn(errors, name);
  const touchedVal = getIn(touched, name);
  const hasError = touchedVal && errorText !== undefined;
  return (
    <KeyboardDatePicker
      {...props}
      format="dd.MM.yyyy"
      disabled={props.disabled || isSubmitting}
      error={hasError}
      name={name}
      helperText={hasError ? errorText : ""}
      onError={error => {
        if (error && errorText !== `${error}`) {
          setFieldError(name, `${error}`);
        }
      }}
      onChange={value => {
        if (value == null) {
          setFieldValue(name, null);
        } else if (isValid(value)) {
          setFieldValue(name, firebase.firestore.Timestamp.fromDate(value));
        }
      }}
      onBlur={onBlur(name)}
      value={
        value?.toDate?.()
          ? utcToZonedTime(value?.toDate?.(), "Europe/Berlin")
          : null
      }
    />
  );
};
