import { alpha, Components, Theme } from "@mui/material";

export const MuiFilledInput = (theme: Theme) => {
  const overwrite: Components["MuiFilledInput"] = {
    styleOverrides: {
      root: {
        borderRadius: theme.shape.borderRadius,
        borderWidth: 4,
        borderColor: "transparent",
        borderStyle: "solid",
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
        transition: theme.transitions.create(["border-color"]),
        "&.Mui-error": {
          borderColor: alpha(theme.palette.error.main, 0.3)
        },
        "&.Mui-focused": {
          borderColor: theme.palette.action.hover
        },
        "&:hover:not(.Mui-disabled)::before": {
          borderBottom: "none"
        },
        "&.Mui-disabled::before": {
          borderBottomStyle: "none !important"
        }
      },
      input: {
        padding: "25px 12px 10px"
      },
      underline: {
        "& .Mui-disabled::before": {
          borderBottomStyle: "none"
        },
        "&::before": {
          borderBottom: "none"
        },
        "&::after": {
          borderBottom: "none"
        },
        "&:hover::before": {
          borderBottom: "none"
        },
        "&:hover::after": {
          borderBottom: "none"
        }
      },
      multiline: {
        display: "flex",
        flexDirection: "column",
        padding: "10px 12px 10px"
      }
    }
  };
  return overwrite;
};
