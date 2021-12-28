import { DatePicker, DatePickerProps } from "@mui/lab";
import { TextField, TextFieldProps } from "@mui/material";
import { isValid } from "date-fns";
import { FieldProps, getIn } from "formik";
import React from "react";

export type FormikDatePickerDateProps = React.PropsWithChildren<
  DatePickerProps<Date> &
    FieldProps<Date | null, any> &
    Pick<TextFieldProps, "disabled" | "variant" | "fullWidth">
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
    variant = "filled",
    fullWidth,
    form: { setFieldValue, setFieldError, errors, touched, isSubmitting },
    field: { name, value },
    ...props
  }: FormikDatePickerDateProps) => {
    const errorText = getIn(errors, name);
    const touchedVal = getIn(touched, name);
    const hasError = touchedVal && errorText !== undefined;

    return (
      <DatePicker<Date>
        {...props}
        mask="__.__.____"
        inputFormat="dd.MM.yyyy"
        disabled={disabled || isSubmitting}
        onError={(error) => {
          if (error && errorText !== `${error}`) {
            setFieldError(name, `${error}`);
          }
        }}
        onChange={(value) => {
          if (value == null) {
            setFieldValue(name, null);
          } else if (isValid(value)) {
            setFieldValue(name, value);
          }
        }}
        value={value}
        renderInput={(params) => (
          <TextField
            name={name}
            variant={variant}
            fullWidth={fullWidth}
            disabled={disabled || isSubmitting}
            {...params}
            helperText={hasError ? errorText : ""}
            error={hasError}
          />
        )}
      />
    );
  },
  propsAreEqual
);
