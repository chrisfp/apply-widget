import { Box, StyledEngineProvider, Theme, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { de } from "date-fns/locale";
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
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
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
