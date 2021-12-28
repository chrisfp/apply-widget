import { Components, Theme } from "@mui/material";

export const MuiInputLabel = (theme: Theme) => {
  const overwrite: Components["MuiInputLabel"] = {
    styleOverrides: {
      filled: {
        transform: "translate(15px, 21px) scale(1)",
        "&[data-shrink=true]": {
          transform: "translate(15px, 12px) scale(0.75)",
        },
      },
    },
  };
  return overwrite;
};
