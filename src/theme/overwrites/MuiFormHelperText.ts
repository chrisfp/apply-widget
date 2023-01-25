import { Components, Theme } from "@mui/material";

export const MuiFormHelperText = (theme: Theme) => {
  const overwrite: Components["MuiFormHelperText"] = {
    styleOverrides: {
      root: {
        marginBottom: "0 !important",
        marginLeft: "14px !important"
      }
    }
  };
  return overwrite;
};
