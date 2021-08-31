import { Theme } from "@material-ui/core";
import { Overrides } from "@material-ui/core/styles/overrides";

export const MuiFilledInput = (theme: Theme) => {
  const override: Overrides["MuiFilledInput"] = {
    root: {
      borderRadius: theme.spacing(1, 1, 1, 1),
      borderWidth: 3,
      borderColor: "transparent",
      borderStyle: "solid",
      borderTopLeftRadius: theme.spacing(1),
      borderTopRightRadius: theme.spacing(1),
      transition: theme.transitions.create(["border-color"]),
      "&$error": {
        borderColor: theme.palette.error.main,
      },
      "&$focused": {
        borderColor: theme.palette.action.hover,
      },
      "& .MuiInputAdornment-positionEnd": {
        marginRight: -theme.spacing(1),
      },
    },
    underline: {
      "&$disabled::before": {
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
  };
  return override;
};
