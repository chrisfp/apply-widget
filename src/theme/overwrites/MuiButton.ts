import { Theme } from "@mui/material";

export const MuiButton = (theme: Theme) => ({
  styleOverrides: {
    // root: { fontFamily: "PPAgrandir-Wide", fontWeight: "medium" },
    contained: {
      borderRadius: theme.spacing(3),
      boxShadow: "0 1px 1px 0 rgba(0,0,0,0.14)",
      // backgroundColor: colors.grey[100],
      // "&:hover": {
      //   backgroundColor: colors.grey[300],
      // },
    },
  },
});
