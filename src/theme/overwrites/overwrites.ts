import { Components, Theme } from "@mui/material";

import { MuiAlert } from "./MuiAlert";
import { MuiAvatar } from "./MuiAvatar";
import { MuiAvatarGroup } from "./MuiAvatarGroup";
import { MuiButton } from "./MuiButton";
import { MuiCheckbox } from "./MuiCheckbox";
import { MuiFilledInput } from "./MuiFilledInput";
import { MuiFormControlLabel } from "./MuiFormControlLabel";
import { MuiInputLabel } from "./MuiInputLabel";
import { MuiLink } from "./MuiLink";
import { MuiPaper } from "./MuiPaper";
import { MuiTab } from "./MuiTab";
import { MuiTableCell } from "./MuiTableCell";
import { MuiTabs } from "./MuiTabs";
import { MuiTypography } from "./MuiTypography";

export const overwrites = (theme: Theme) =>
  ({
    MuiButton: MuiButton(theme),
    MuiFilledInput: MuiFilledInput(theme),
    MuiInputLabel: MuiInputLabel(theme),
    MuiLink: MuiLink(theme),
    MuiTabs: MuiTabs(theme),
    MuiCheckbox: MuiCheckbox(theme),
    MuiFormControlLabel: MuiFormControlLabel(theme),
    MuiTab: MuiTab(theme),
    MuiTableCell: MuiTableCell(theme),
    MuiPaper: MuiPaper(theme),
    MuiTypography: MuiTypography(theme),
    MuiAlert: MuiAlert(theme),
    MuiAvatar: MuiAvatar(theme),
    MuiAvatarGroup: MuiAvatarGroup(theme)
  } as Components);
