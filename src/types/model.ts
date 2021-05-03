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
  readonly created: firebase.firestore.Timestamp & {
    _seconds: number;
    _nanoseconds: number;
  };
}
export interface StoreItemTimestamped {
  readonly lastUpdate: firebase.firestore.Timestamp & {
    _seconds: number;
    _nanoseconds: number;
  };
}
export interface CaUserId {
  readonly userId: string;
}

export interface CaPreviousEmployment {
  fromDate: firebase.firestore.Timestamp | null;
  type?: CaPreviousEmploymentType;
  toDate: firebase.firestore.Timestamp | null;
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
  dateOfBirth: firebase.firestore.Timestamp;
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
  driversLicenseFrontPhotoURL?: string | firebase.firestore.FieldValue;
  driversLicenseBackPhotoURL?: string | firebase.firestore.FieldValue;
  availableAsDriver?: boolean;
  driversLicenseDateIssued?: firebase.firestore.Timestamp;
  nextAvailability?: firebase.firestore.Timestamp | null;
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
