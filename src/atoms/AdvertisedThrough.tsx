import React from "react";

import { CaAdvertisedThroughType } from "../types/enums";

export const AdvertisedThrough = ({
  children
}: {
  children: CaAdvertisedThroughType;
}) => {
  switch (children) {
    case CaAdvertisedThroughType.STUDENTJOB:
      return <>StudentJob</>;
    case CaAdvertisedThroughType.RECRUDO:
      return <>Recrudo</>;
    case CaAdvertisedThroughType.STEPSTONE:
      return <>Stepstone</>;
    case CaAdvertisedThroughType.INDEED:
      return <>Indeed</>;
    case CaAdvertisedThroughType.RECOMMENDATION:
      return <>Empfehlung</>;
    case CaAdvertisedThroughType.FACEBOOK:
      return <>Facebook</>;
    case CaAdvertisedThroughType.INSTAGRAM:
      return <>Instagram</>;
    case CaAdvertisedThroughType.OTHER:
      return <>Andere</>;
    default:
      return null;
  }
};
