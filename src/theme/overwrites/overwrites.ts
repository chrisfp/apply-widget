import { Theme } from "@material-ui/core";
import { Overrides } from "@material-ui/core/styles/overrides";

import { MuiButton } from "./MuiButton";
import { MuiFilledInput } from "./MuiFilledInput";
import { MuiInputLabel } from "./MuiInputLabel";
import { MuiPaper } from "./MuiPaper";
import { MuiTableCell } from "./MuiTableCell";
import { MuiTabs } from "./MuiTabs";

export const overwrites = (theme: Theme) =>
  ({
    MuiButton: MuiButton(theme),
    MuiFilledInput: MuiFilledInput(theme),
    MuiInputLabel: MuiInputLabel(theme),
    MuiTabs: MuiTabs(theme),
    MuiTableCell: MuiTableCell(theme),
    MuiPaper: MuiPaper(theme),
  } as Overrides);
