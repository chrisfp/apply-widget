import { createMuiTheme } from "@material-ui/core/styles";

// A custom theme for this app
export const theme = createMuiTheme({
  overrides: {
    MuiInputBase: {
      input: {
        "&:-webkit-autofill": {
          transitionDelay: "9999s",
          transitionProperty: "background-color, color"
        }
      }
    }
  },
  typography: {
    // fontFamily: '"Helvetica", "Arial", sans-serif'
  },
  palette: {
    // type: "dark",
    primary: {
      main: "#1a375e"
      // main: "#ef9a9a"
    },
    secondary: {
      main: "#fff"
      // main: "#f06292"
      // main: "#f06292"
    },
    background: {
      // default: "#f5f5f5"
    }
  }
});

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#050F46"
    },
    secondary: {
      main: "#FFFFFF"
    }
  }
});
