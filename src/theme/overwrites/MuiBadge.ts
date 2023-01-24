import { Theme } from "@mui/material";

export const MuiBadge = (theme: Theme) => ({
  styleOverrides: {
    root: {
      borderRadius: theme.spacing(2),
      "& span": {
        marginTop: -2,
        paddingBottom: 3,
      },
    },
  },
});
