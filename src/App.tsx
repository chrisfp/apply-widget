import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Box, StyledEngineProvider, Theme, ThemeProvider } from "@mui/material";
import de from "date-fns/locale/de";
import React from "react";

import { ApplyForm } from "./organisms/ApplyForm";
import { theme } from "./theme/theme";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

export interface AppProps {
  companyId: string;
  businessUnits?: string[];
  redirect?: string;
}

export function App({ companyId, businessUnits, redirect }: AppProps) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={de}>
          <Box p={2} style={{ backgroundColor: "#fff" }}>
            <ApplyForm
              companyId={companyId}
              businessUnits={businessUnits}
              redirect={redirect}
            />
          </Box>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
