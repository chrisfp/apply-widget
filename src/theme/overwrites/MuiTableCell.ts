import { Theme } from "@material-ui/core";

export const MuiTableCell = (theme: Theme) => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
});
