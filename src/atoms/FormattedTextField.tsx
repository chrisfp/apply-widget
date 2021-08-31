import { InputBaseProps } from "@material-ui/core";
import MuiTextField, {
  TextFieldProps as MuiTextFieldProps
} from "@material-ui/core/TextField";
import { FieldProps, getIn } from "formik";
import * as React from "react";

export interface FormattedTextFieldProps
  extends FieldProps,
    Omit<MuiTextFieldProps, "name" | "value" | "error"> {
  onFormat?: (value: string) => string;
  onFormatComplex?: (event: React.ChangeEvent<HTMLInputElement>) => string;
}
export interface FormattedTextBaseProps extends InputBaseProps, FieldProps {
  onFormat?: (value: string) => string;
  onFormatComplex?: (event: React.ChangeEvent<HTMLInputElement>) => string;
}

export function fieldToTextField({
  disabled,
  field: { onBlur: fieldOnBlur, onChange, ...field },
  form: { isSubmitting, touched, errors, setFieldValue },
  onBlur,
  onFormat,
  onFormatComplex,
  helperText,
  ...props
}: FormattedTextFieldProps): MuiTextFieldProps {
  const fieldError = getIn(errors, field.name);
  const showError = getIn(touched, field.name) && !!fieldError;

  return {
    variant: props.variant,
    error: showError,
    helperText: showError ? fieldError : helperText,
    disabled: disabled ?? isSubmitting,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onFormat) {
        e.target.value = onFormat?.(e.target.value);
      }
      if (onFormatComplex) {
        onFormatComplex?.(e);
      }
      onChange(e);
    },
    onBlur: function(e) {
      setFieldValue(field.name, field.value?.trim() || "");
      if (onBlur) {
        fieldOnBlur(e ?? field.name);
      }
    },
    ...field,
    ...props
  };
}

export function fieldToTextBase({
  disabled,
  field: { onBlur: fieldOnBlur, onChange, ...field },
  form: { isSubmitting, touched, errors, setFieldValue },
  onBlur,
  onFormat,
  onFormatComplex,
  ...props
}: FormattedTextBaseProps): InputBaseProps {
  const fieldError = getIn(errors, field.name);
  const showError = getIn(touched, field.name) && !!fieldError;

  return {
    error: showError,
    disabled: disabled ?? isSubmitting,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onFormat) {
        e.target.value = onFormat?.(e.target.value);
      }
      if (onFormatComplex) {
        onFormatComplex?.(e);
      }
      onChange(e);
    },
    onBlur: function(e) {
      setFieldValue(field.name, field.value?.trim() || "");
      if (onBlur) {
        fieldOnBlur(e ?? field.name);
      }
    },
    ...field,
    ...props
  };
}

export function FormattedTextField({
  children,
  ...props
}: FormattedTextFieldProps) {
  React.useEffect(() => {
    if (props.onFormat && props.field.value) {
      const formatted = props.onFormat(props.field.value);
      if (formatted !== props.field.value) {
        props.form.setFieldValue(props.field.name, formatted);
      }
    }
    if (props.onFormatComplex && props.field.value && props.field.value) {
      const formatted = props.onFormatComplex({
        selectionEnd: 0,
        target: { value: props.field.value }
      } as any);
      if (formatted !== props.field.value) {
        props.form.setFieldValue(props.field.name, formatted);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <MuiTextField {...fieldToTextField(props)}>{children}</MuiTextField>;
}

export interface FormattedTextBaseFieldProps
  extends FieldProps,
    Omit<InputBaseProps, "name" | "value" | "error"> {
  component: (props: InputBaseProps) => JSX.Element;
}

export function FormattedTextBaseField({
  component: CustomComponent,
  ...props
}: FormattedTextBaseFieldProps) {
  return <CustomComponent {...fieldToTextBase(props)} />;
}
