import { Components, Theme } from "@mui/material";

import { MuiAlert } from "./MuiAlert";
import { MuiAvatar } from "./MuiAvatar";
import { MuiAvatarGroup } from "./MuiAvatarGroup";
import { MuiBadge } from "./MuiBadge";
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
    MuiAlert: MuiAlert(theme),
    MuiAvatar: MuiAvatar(theme),
    MuiAvatarGroup: MuiAvatarGroup(theme),
    MuiBadge: MuiBadge(theme),
    MuiButton: MuiButton(theme),
    MuiCheckbox: MuiCheckbox(theme),
    MuiFilledInput: MuiFilledInput(theme),
    MuiFormControlLabel: MuiFormControlLabel(theme),
    MuiInputLabel: MuiInputLabel(theme),
    MuiLink: MuiLink(theme),
    MuiPaper: MuiPaper(theme),
    MuiTab: MuiTab(theme),
    MuiTableCell: MuiTableCell(theme),
    MuiTabs: MuiTabs(theme),
    MuiTypography: MuiTypography(theme)
  } as Components);
