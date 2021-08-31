import { createMuiTheme, ThemeOptions } from "@material-ui/core";

import { overwrites } from "./overwrites/overwrites";
import { palette } from "./palette";
import { typography } from "./typography";

const baseTheme: ThemeOptions = {
  palette,
  typography,
};

const themeWithColors = createMuiTheme(baseTheme);
export const theme = createMuiTheme({
  ...baseTheme,
  overrides: overwrites(themeWithColors),
});

export type CustomTheme = typeof theme;
