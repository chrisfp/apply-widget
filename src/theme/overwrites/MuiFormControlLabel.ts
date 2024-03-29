import { Components, Theme } from "@mui/material";

export const MuiFormControlLabel = (theme: Theme) => {
  const overwrite: Components["MuiFormControlLabel"] = {
    styleOverrides: {
      root: {
        marginTop: theme.spacing(2)
      }
    }
  };
  return overwrite;
};
