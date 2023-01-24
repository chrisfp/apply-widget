import { Components, Theme } from "@mui/material";

export const MuiAlert = (theme: Theme) =>
  ({
    styleOverrides: {
      root: {
        borderRadius: theme.spacing(2),
        paddingRight: theme.spacing(3),
        paddingTop: theme.spacing(2)
      }
    }
  } as Components["MuiAlert"]);
