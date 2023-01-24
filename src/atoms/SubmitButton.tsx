import { Button, CircularProgress } from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
import React from "react";

export interface SubmitButtonProps {
  isSubmitting?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps & ButtonProps> = (
  { isSubmitting = false, children, ...props },
  dataCy
) => {
  return (
    <Button
      data-cy={dataCy}
      type="submit"
      disabled={isSubmitting}
      color="primary"
      size="large"
      variant="contained"
      aria-label="submit"
      endIcon={isSubmitting && <CircularProgress size={16} color="secondary" />}
      {...props}
    >
      {children}
    </Button>
  );
};
