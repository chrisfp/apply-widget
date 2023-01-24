import { Theme } from "@mui/material";

export const MuiButton = (theme: Theme) => ({
  styleOverrides: {
    contained: {
      borderRadius: theme.spacing(3),
      boxShadow: "0 1px 1px 0 rgba(0,0,0,0.14)",
    },
    text: {
      borderRadius: theme.spacing(3),
      padding: theme.spacing(1, 2),
    },
  },
});
