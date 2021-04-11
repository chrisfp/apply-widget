import DateFnsUtils from "@date-io/date-fns";
import { Box } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import deLocale from "date-fns/locale/de";
import React from "react";

import { ApplyForm } from "./organisms/ApplyForm";

export interface AppProps {
  companyId: string;
}

export function App({ companyId }: AppProps) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
      <Box p={2} style={{ backgroundColor: "#fff" }}>
        <ApplyForm companyId={companyId} />
      </Box>
    </MuiPickersUtilsProvider>
  );
}
