import React from "react";

import { CaBusinessUnitType } from "../types/enums";

export const BusinessUnit = ({
  children
}: {
  children: CaBusinessUnitType;
}) => {
  switch (children) {
    case CaBusinessUnitType.BERLIN:
      return <React.Fragment>Berlin</React.Fragment>;
    case CaBusinessUnitType.DUS:
      return <React.Fragment>Düsseldorf</React.Fragment>;
    case CaBusinessUnitType.TRAVEL:
      return <React.Fragment>Reiseteam (bundesweit)</React.Fragment>;
    default:
      return null;
  }
};
