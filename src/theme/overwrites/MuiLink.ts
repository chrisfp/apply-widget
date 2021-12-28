import { Components, Theme } from "@mui/material";

export const MuiLink = (theme: Theme) => {
  const overwrite: Components["MuiLink"] = {
    defaultProps: {
      underline: "hover",
    },
  };
  return overwrite;
};
