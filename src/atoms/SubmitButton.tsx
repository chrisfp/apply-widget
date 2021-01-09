import {
  Button,
  CircularProgress,
  createStyles,
  makeStyles,
  Theme
} from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    spinner: {
      color: theme.palette.primary.contrastText,
      margin: theme.spacing(1) * 0.5
    }
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
