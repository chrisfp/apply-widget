import { Theme } from "@mui/material";

export const MuiAvatarGroup = (theme: Theme) => ({
  styleOverrides: {
    root: {
      justifyContent: "flex-end",
      paddingLeft: theme.spacing(1),
      "& .MuiAvatar-root": {
        boxSizing: "border-box"
      },
      "& .MuiAvatar-root:last-child": {
        marginLeft: theme.spacing(-1)
      }
    }
  }
});
