import { Theme } from "@mui/material";

export const MuiTab = (theme: Theme) => ({
  styleOverrides: {
    root: { [theme.breakpoints.up("md")]: { minWidth: 160 } },
  },
});
