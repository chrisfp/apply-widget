import { TextField, TextFieldProps } from "@mui/material";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers";
import { parse } from "date-fns";
import { FieldProps, getIn } from "formik";
import React from "react";

export type FormikDatePickerDateProps = React.PropsWithChildren<
  DatePickerProps<Date, Date> &
    FieldProps<Date | null, any> &
    Pick<
      TextFieldProps,
      "InputLabelProps" | "disabled" | "variant" | "fullWidth"
    > & {
      "data-cy": string;
    }
>;

const propsAreEqual = (
  prevProps: Readonly<React.PropsWithChildren<FormikDatePickerDateProps>>,
  nextProps: Readonly<React.PropsWithChildren<FormikDatePickerDateProps>>
) => {
  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.form.isSubmitting === nextProps.form.isSubmitting &&
    prevProps.field.value === nextProps.field.value &&
    prevProps.form.errors[nextProps.field.name] ===
      nextProps.form.errors[nextProps.field.name] &&
    prevProps.form.touched[nextProps.field.name] ===
      nextProps.form.touched[nextProps.field.name]
  );
};

export const FormikDatePickerDate = React.memo(
  ({
    disabled,
    InputLabelProps,
    "data-cy": dataCy,
    variant = "filled",
    fullWidth,
    form: {
      setFieldValue,
      setFieldError,
      errors,
      touched,
      isSubmitting,
      setFieldTouched,
    },
    field: { name, value },
    autoComplete,
    ...props
  }: FormikDatePickerDateProps & { autoComplete?: string }) => {
    const errorText = getIn(errors, name);
    const touchedVal = getIn(touched, name);
    const hasError = touchedVal != null && errorText !== undefined;
    return (
      <DatePicker
        {...props}
        mask="__.__.____"
        inputFormat="dd.MM.yyyy"
        disabled={disabled || isSubmitting}
        ignoreInvalidInputs
        onChange={(date, keyboardInputValue) => {
          // See https://github.com/jaredpalmer/formik/issues/706
          if (keyboardInputValue != null) {
            if (
              /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/.test(
                keyboardInputValue
              )
            ) {
              const newFieldValue = parse(
                keyboardInputValue,
                "dd.MM.yyyy",
                new Date()
              );
              setFieldValue(name, newFieldValue, true);
            } else {
              setFieldValue(name, Date.parse("foo"), false);
              setFieldError(name, "Ungültiges Datum (TT.MM.JJJJ)");
            }
          } else if (date) {
            setFieldValue(name, date, true);
          } else if (keyboardInputValue == null && date == null) {
            setFieldValue(name, null, false);
          }
        }}
        value={value}
        renderInput={(params) => (
          <TextField
            InputLabelProps={InputLabelProps}
            inputProps={{
              placeholder: "TT.MM.JJJJ",
              ...params.inputProps,
            }}
            name={name}
            {...params}
            variant={variant}
            fullWidth={fullWidth}
            autoComplete={autoComplete}
            disabled={disabled || isSubmitting}
            helperText={hasError ? errorText : ""}
            error={hasError}
            data-cy={dataCy}
            onBlur={() => {
              // See https://github.com/jaredpalmer/formik/issues/706
              setFieldTouched(name, true, false);
              setFieldError(name, errorText);
            }}
          />
        )}
      />
    );
  },
  propsAreEqual
);
