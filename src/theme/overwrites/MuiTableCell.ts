import { Theme } from "@mui/material";

export const MuiTableCell = (theme: Theme) => ({
  styleOverrides: {
    root: {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },
});
