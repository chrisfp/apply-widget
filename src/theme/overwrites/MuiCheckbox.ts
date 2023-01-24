import { Components, Theme } from "@mui/material";

export const MuiCheckbox = (theme: Theme) => {
  const overwrite: Components["MuiCheckbox"] = {
    styleOverrides: {
      root: {
        alignSelf: "flex-start",
        postion: "relative",
        top: -10,
      },
    },
  };
  return overwrite;
};
