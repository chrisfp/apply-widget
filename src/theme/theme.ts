import { createTheme, ThemeOptions } from "@mui/material";

import { overwrites } from "./overwrites/overwrites";
import { paletteDark, paletteLight } from "./palette";
import { typography } from "./typography";

const shape = {
  borderRadius: 8
};
const baseTheme: ThemeOptions = {
  shape,
  palette: paletteLight,
  typography
};
const baseDarkTheme: ThemeOptions = {
  shape,
  palette: paletteDark,
  typography
};

const themeWithDarkColors = createTheme(baseDarkTheme);
const themeWithColors = createTheme(baseTheme);
export const theme = createTheme({
  shape,
  palette: paletteLight,
  typography,
  components: overwrites(themeWithColors)
});
export const darkTheme = createTheme({
  shape,
  palette: paletteDark,
  typography,
  components: overwrites(themeWithDarkColors)
});
