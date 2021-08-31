import { Theme } from "@material-ui/core";
import { TypographyOptions } from "@material-ui/core/styles/createTypography";

export const typography = (palette: Theme["palette"]) =>
  ({
    fontFamily: ["roboto", "sans-serif"].join(",")
  } as TypographyOptions);
