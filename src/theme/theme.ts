import { createTheme, ThemeOptions } from "@mui/material";

import { overwrites } from "./overwrites/overwrites";
import { palette } from "./palette";
import { typography } from "./typography";

const baseTheme: ThemeOptions = {
  palette,
  typography,
};

const themeWithColors = createTheme(baseTheme);
export const theme = createTheme({
  palette,
  typography,
  components: overwrites(themeWithColors),
});
