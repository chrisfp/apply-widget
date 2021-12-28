import { Theme } from "@mui/material";

export const MuiAlert = (theme: Theme) => ({
  styleOverrides: {
    root: {
      borderRadius: theme.spacing(2),
    },
  },
});
