import { Theme } from "@material-ui/core";
import { Overrides } from "@material-ui/core/styles/overrides";

export const MuiInputLabel = (theme: Theme) => {
  const override: Overrides["MuiInputLabel"] = {
    filled: {
      transform: "translate(15px, 23px) scale(1)",
      "&$shrink": {
        transform: "translate(15px, 14px) scale(0.75)",
      },
      "&$marginDense": {
        transform: "translate(15px, 19px) scale(1)",
      },
      "&$shrink$marginDense": {
        transform: "translate(15px, 11px) scale(0.75) !important",
      },
    },
  };
  return override;
};
