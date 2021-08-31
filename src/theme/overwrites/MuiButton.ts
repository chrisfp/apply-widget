import { colors, Theme } from "@material-ui/core";

export const MuiButton = (theme: Theme) => ({
  contained: {
    borderRadius: theme.spacing(1),
    boxShadow: "0 1px 1px 0 rgba(0,0,0,0.14)",
    backgroundColor: colors.grey[100],
    "&:hover": {
      backgroundColor: colors.grey[300],
    },
  },
});
