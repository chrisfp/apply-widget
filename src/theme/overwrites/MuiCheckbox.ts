import { Components, Theme } from "@mui/material";

export const MuiCheckbox = (theme: Theme) => {
  const overwrite: Components["MuiCheckbox"] = {
    styleOverrides: {
      root: {
        alignSelf: "flex-start",
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
  };
  return overwrite;
};
