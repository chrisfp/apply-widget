import { Components, Theme } from "@mui/material";

export const MuiFilledInput = (theme: Theme) => {
  const overwrite: Components["MuiFilledInput"] = {
    styleOverrides: {
      root: {
        borderRadius: theme.spacing(1, 1, 1, 1),
        borderWidth: 3,
        borderColor: "transparent",
        borderStyle: "solid",
        borderTopLeftRadius: theme.spacing(1),
        borderTopRightRadius: theme.spacing(1),
        transition: theme.transitions.create(["border-color"]),
        "& .Mui-error": {
          borderColor: theme.palette.error.main,
        },
        "& .Mui-focused": {
          borderColor: theme.palette.action.hover,
        },
        "&:hover:not(.Mui-disabled)::before": {
          borderBottom: "none",
        },
        "&.Mui-disabled::before": {
          borderBottomStyle: "none !important",
        },
      },
      input: {
        padding: "25px 12px 10px",
      },
      underline: {
        "& .Mui-disabled::before": {
          borderBottomStyle: "none",
        },
        "&::before": {
          borderBottom: "none",
        },
        "&::after": {
          borderBottom: "none",
        },
        "&:hover::before": {
          borderBottom: "none",
        },
        "&:hover::after": {
          borderBottom: "none",
        },
      },
    },
  };
  return overwrite;
};
