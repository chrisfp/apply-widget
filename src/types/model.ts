import { FieldValue, Timestamp } from "firebase/firestore";

import { removeUndefinedFields } from "../utils/helpers";
import {
  CaAdvertisedThroughType,
  CaBusinessUnitType,
  CaDenominationType,
  CaEmployeeOccupationType,
  CaOnboardingState,
  CaPreviousEmploymentType
} from "./enums";

export enum CaUserRole {
  APPLICANT = "APPLICANT",
  FUNDRAISER = "FUNDRAISER",
  JUNIOR_TEAMLEADER = "JUNIOR_TEAMLEADER",
  SENIOR_TEAMLEADER = "SENIOR_TEAMLEADER",
  MENTOR = "MENTOR",
  HR = "HR",
  COACH = "COACH",
  ADMIN = "ADMIN",
  CEO = "CEO",
  SUPER = "SUPER",
  PAUSE = "PAUSE",
  OUT = "OUT",
  ORG = "ORG"
}

export enum CaUserGenderType {
  MALE = "MALE",
  FEMALE = "FEMALE",
  DIVERSE = "DIVERSE"
}

export interface StoreItem {
  readonly created: Timestamp & {
    _seconds: number;
    _nanoseconds: number;
  };
}
export interface StoreItemTimestamped {
  readonly lastUpdate: Timestamp & {
    _seconds: number;
    _nanoseconds: number;
  };
}
export interface CaUserId {
  readonly userId: string;
}

export interface CaPreviousEmployment {
  fromDate: Timestamp | null;
  type?: CaPreviousEmploymentType;
  toDate: Timestamp | null;
  employerName: string;
  daysWorked: number | null;
}

export interface CaUser extends CaUserId, StoreItem, StoreItemTimestamped {
  role: CaUserRole;
  firstName: string;
  lastName: string;
  email: string;
  est?: number | null;
  phoneNumber: string;
  displayName: string;
  birthName?: string;
  origPhotoURL?: string;
  photoURL?: string;
  dateOfBirth: Timestamp;
  businessUnit?: CaBusinessUnitType;
  city?: string;
  state: string;
  street?: string;
  number?: string;
  postalCode?: string;
  gender?: CaUserGenderType;
  placeOfBirth?: string;
  countryOfBirth?: string;
  nationality?: string;
  occupation?: CaEmployeeOccupationType;
  iban?: string;
  bank?: string;
  insurance?: string;
  taxId?: string;
  martialStatus?: "single" | "married";
  previousEmployments?: CaPreviousEmployment[];
  numberOfChildren?: number;
  socialSecurityNumber?: string;
  denomination?: CaDenominationType;
  driversLicense?: boolean;
  driversLicenseFrontPhotoURL?: string | FieldValue;
  driversLicenseBackPhotoURL?: string | FieldValue;
  availableAsDriver?: boolean;
  driversLicenseDateIssued?: Timestamp;
  nextAvailability?: Timestamp | null;
  nextAvailabilityComment?: string;
  advertisedThrough?: CaAdvertisedThroughType;
  onboardingState?: CaOnboardingState;
  recommendationClaim?: string;
  companyId: string;
  organizationId?: string;
  disabled?: boolean;
  emailVerified?: boolean;
  fundraiserNumber: number;
}
export const extractUserPublicSnippet = (
  user: Pick<
    CaUser,
    | "userId"
    | "role"
    | "displayName"
    | "firstName"
    | "lastName"
    | "photoURL"
    | "fundraiserNumber"
  >
) =>
  removeUndefinedFields({
    userId: user.userId,
    role: user.role,
    displayName: user.displayName,
    firstName: user.firstName,
    lastName: user.lastName,
    photoURL: user.photoURL,
    fundraiserNumber: user.fundraiserNumber
  });
export type CaUserPublicSnippet = ReturnType<typeof extractUserPublicSnippet>;
