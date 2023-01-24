import { Theme } from "@mui/material";

export const MuiAvatar = (theme: Theme) => ({
  styleOverrides: {
    root: {
      paddingBottom: 3,
      "& img": { height: "auto", marginBottom: -3 },
      textDecoration: "none !important",
    },
  },
});
