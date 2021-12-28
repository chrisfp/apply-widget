import { Theme } from "@mui/material";

export const MuiTabs = (theme: Theme) => ({
  styleOverrides: {
    root: {},
    indicator: {
      // height: 1
      zIndex: 3,
      backgroundColor: theme.palette.primary.main,
    },
  },
});
