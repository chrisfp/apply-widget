import "fontsource-roboto";

import DateFnsUtils from "@date-io/date-fns";
import { Box, ThemeProvider } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import deLocale from "date-fns/locale/de";
import React from "react";

import { ApplyForm } from "./organisms/ApplyForm";
import { theme } from "./theme/theme";

export interface AppProps {
  companyId: string;
  businessUnits?: string;
}

export function App({ companyId, businessUnits }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
        <Box p={2} style={{ backgroundColor: "#fff" }}>
          <ApplyForm companyId={companyId} businessUnits={businessUnits} />
        </Box>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}
