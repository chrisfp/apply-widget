import { Button, CircularProgress, Theme } from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    spinner: {
      color: theme.palette.primary.contrastText,
      margin: theme.spacing(0.5),
    },
  })
);

export interface SubmitButtonProps {
  isSubmitting?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps & ButtonProps> = ({
  isSubmitting = false,
  children,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      color="primary"
      size="large"
      variant="contained"
      aria-label="submit"
      {...props}
    >
      {isSubmitting ? (
        <CircularProgress size={16} className={classes.spinner} />
      ) : (
        children
      )}
    </Button>
  );
};
