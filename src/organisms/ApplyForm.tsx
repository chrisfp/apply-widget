import "firebase/firestore";

import {
  Box,
  Button,
  Chip,
  FormHelperText,
  Grid,
  Link,
  makeStyles,
  MenuItem,
  Typography
} from "@material-ui/core";
import { DraftsTwoTone } from "@material-ui/icons";
import { addYears } from "date-fns";
import firebase from "firebase/app";
import { Field, Form, Formik, FormikProps } from "formik";
import { TextField } from "formik-material-ui";
import { KeyboardDatePicker } from "formik-material-ui-pickers";
import parsePhoneNumberFromString from "libphonenumber-js";
import React, { useRef, useState } from "react";
import * as yup from "yup";

import { AdvertisedThrough } from "../atoms/AdvertisedThrough";
import { BusinessUnit } from "../atoms/BusinessUnit";
import { FormattedTextField } from "../atoms/FormattedTextField";
import { FormControlCheckbox } from "../atoms/FormControlCheckbox";
import { SubmitButton } from "../atoms/SubmitButton";
import {
  formatCapitalizeFirst,
  formatLowerCaseTrim,
  formatPhoneNumberCountryCode
} from "../formatters";
import { firebaseApply } from "../index";
import { CaAdvertisedThroughType, CaBusinessUnitType } from "../types/enums";
import { CaUser } from "../types/model";
import { enumKeys } from "../utils/helpers";

export const validationSchema = (noLegal: boolean = false) => () =>
  yup.object().shape({
    firstName: yup
      .string()
      .trim()
      .required("Pflichtfeld"),
    lastName: yup
      .string()
      .trim()
      .required("Pflichtfeld"),
    email: yup
      .string()
      .trim()
      .email("Ungültige Email Adresse")
      .required("Pflichtfeld"),
    advertisedThrough: yup
      .string()
      .trim()
      .required("Pflichtfeld"),
    businessUnit: yup
      .string()
      .trim()
      .required("Pflichtfeld"),
    recommendationClaim: yup.string().when("advertisedThrough", {
      is: CaAdvertisedThroughType.RECOMMENDATION,
      then: yup.string().required("Name und/oder Fundraisernummer erforderlich")
    }),
    phoneNumber: yup
      .string()
      .trim()
      .min(4)
      .required()
      .test({
        name: "validNumber",
        test: function(phoneNumber?: string) {
          if (
            !phoneNumber ||
            parsePhoneNumberFromString(phoneNumber)?.isValid() !== true
          ) {
            return this.createError({
              message: `Ungültige Telefonnummer`,
              path: "phoneNumber" // Fieldname
            });
          }
          return true;
        }
      }),

    ...(noLegal
      ? {}
      : {
          disclaimerConfirmed: yup
            .bool()
            .oneOf(
              [true],
              "Das Akzeptieren unserer AGB und Datenschutzhinweise ist erforderlich."
            )
            .required("Pflichtfeld"),
          contactConfirmed: yup
            .bool()
            .oneOf(
              [true],
              "Bewerbungsdialog und Einsatzplanung sind ohne Kontakt leider nicht möglich."
            )
            .required("Pflichtfeld")
        }),
    city: yup
      .string()
      .trim()
      .required("Pflichtfeld"),
    dateOfBirth: yup
      .date()
      .nullable()
      .required("Pflichtfeld")
  });

const useStyles = makeStyles(theme => ({
  signInLink: {
    marginTop: theme.spacing(3)
  },
  gutterTop: {
    marginTop: theme.spacing(3)
  },
  sliderMarginTop: {
    marginTop: theme.spacing(3)
  },
  formParagraph: {
    marginBottom: theme.spacing(2)
  },
  listOperationButton: {
    marginTop: theme.spacing(1),
    marginRight: "-8px",
    marginLeft: theme.spacing(1)
  },
  fullWidth: {
    width: "100%"
  },
  checkboxTop: {
    marginTop: theme.spacing(1),
    "& label": {
      alignItems: "start"
    },
    "& label > span:first-child": {
      marginTop: -10
    },
    "& .MuiCheckbox-root": {
      marginTop: -theme.spacing(1)
    }
  },
  fixBorders: {
    "& input": {
      color: `${theme.palette.text.primary} !important`,
      backgroundColor: `transparent !important`,
      border: `none !important`,
      fontSize: 14,
      height: 56,
      paddingBottom: 10,
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 27
    }
  },
  chips: {
    marginTop: theme.spacing(3),

    marginBottom: theme.spacing(3),
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5)
    }
  },
  errorlabel: {
    marginBottom: theme.spacing(2)
  }
}));

export interface ApplyFormValues {
  firstName: string;
  advertisedThrough: string;
  lastName: string;
  email: string;
  recommendationClaim: string;
  businessUnit: CaBusinessUnitType | "";
  phoneNumber: string;
  disclaimerConfirmed: boolean;
  contactConfirmed: boolean;
  city: string;
  dateOfBirth: Date | null;
  companyId: string;
}

interface ApplyFormFormikProps {
  user?: CaUser;
  noLegal?: boolean;
  submitText?: string;
  companyId: string;
  businessUnits?: string;
  onSubmit?: (values: ApplyFormValues) => void;
}

export const ApplyForm = ({
  user,
  noLegal,
  companyId,
  businessUnits,
  submitText = "Jetzt Bewerben!",
  onSubmit
}: ApplyFormFormikProps) => {
  const [initialValues] = useState<ApplyFormValues>({
    firstName: "",
    advertisedThrough: "",
    recommendationClaim: "",
    city: "",
    dateOfBirth: null,
    lastName: "",
    email: "",
    businessUnit:
      businessUnits?.length === 1
        ? (businessUnits[0] as CaBusinessUnitType)
        : "",
    phoneNumber: "",
    disclaimerConfirmed: false,
    contactConfirmed: false,
    companyId
  });
  const recruitingMode = Boolean(user);
  let formikRef = useRef<FormikProps<any>>();
  const nameField = useRef<HTMLInputElement | null>(null);
  const [applied, setApplied] = useState(false);
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <React.Fragment>
      <Formik
        innerRef={formikRef as any}
        initialValues={initialValues}
        validationSchema={validationSchema(noLegal)}
        onSubmit={async (values, { setFieldError, setFieldValue }) => {
          const phoneNumberStripped = `${values.phoneNumber}`.replace(
            /^\s+|\s+$/g,
            ""
          );
          if (phoneNumberStripped.startsWith("00")) {
            setFieldValue("phoneNumber", `+${phoneNumberStripped.substr(2)}`);
            values.phoneNumber = `+${phoneNumberStripped.substr(2)}`;
          } else if (phoneNumberStripped.startsWith("0")) {
            setFieldValue("phoneNumber", `+49${phoneNumberStripped.substr(1)}`);
            values.phoneNumber = `+49${phoneNumberStripped.substr(1)}`;
          }
          if (recruitingMode) {
            setFieldValue(
              "advertisedThrough",
              CaAdvertisedThroughType.RECOMMENDATION
            );
            values.advertisedThrough = CaAdvertisedThroughType.RECOMMENDATION;
          }
          if (!values.dateOfBirth) {
            throw new Error("dateOfBirth missing");
          }
          try {
            await firebaseApply({
              ...values,
              dateOfBirth: firebase.firestore.Timestamp.fromDate(
                values.dateOfBirth
              )
            });
            onSubmit?.(values);
            setApplied(true);
          } catch (error) {
            if (error instanceof Error) {
              if (
                error.message === "Die Email Adresse ist bereits registriert"
              ) {
                setFieldError("email", error.message);
              } else if (error.message === "Ungültige Email Adresse") {
                setFieldError("email", error.message);
              } else if (
                error.message === "Die Handynummer ist bereits registriert"
              ) {
                setFieldError("phoneNumber", error.message);
              } else if (error.message === "Ungültige Handynummer") {
                setFieldError("phoneNumber", error.message);
              } else {
                setErrorMessage(error.message);
              }
            }
          }
          return;
        }}
      >
        {({
          submitForm,
          isSubmitting,
          resetForm,
          values,
          setFieldValue,
          errors
        }) =>
          !applied ? (
            <Form className={classes.fixBorders}>
              <input name="city" style={{ opacity: 0, position: "absolute" }} />
              {recruitingMode && (
                <>
                  <input
                    name="firstName"
                    style={{ opacity: 0, position: "absolute" }}
                  />
                  <input
                    name="lastName"
                    style={{ opacity: 0, position: "absolute" }}
                  />
                  <input
                    name="dateOfBirth"
                    style={{ opacity: 0, position: "absolute" }}
                  />
                  <input
                    name="phoneNumber"
                    style={{ opacity: 0, position: "absolute" }}
                  />
                </>
              )}
              <Grid container spacing={2} className={classes.formParagraph}>
                <Grid item xs={12} sm={6}>
                  <Field
                    fullWidth
                    variant="filled"
                    name="firstName"
                    type="text"
                    label="Vorname"
                    inputRef={nameField}
                    onFormat={formatCapitalizeFirst}
                    component={FormattedTextField}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    fullWidth
                    variant="filled"
                    name="lastName"
                    type="text"
                    label="Nachname"
                    onFormat={formatCapitalizeFirst}
                    component={FormattedTextField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    fullWidth
                    variant="filled"
                    name="city"
                    type="text"
                    label="Wohnort"
                    autoComplete="no"
                    onFormat={formatCapitalizeFirst}
                    component={FormattedTextField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    fullWidth
                    inputVariant="filled"
                    name="dateOfBirth"
                    openTo="year"
                    views={["year", "month", "date"]}
                    maxDate={addYears(new Date(), -16)}
                    maxDateMessage="Mindestalter: 16 Jahre"
                    invalidDateMessage="Ungültiges Datum"
                    label="Geburtsdatum"
                    autoComplete="no"
                    format="dd.MM.yyyy"
                    component={KeyboardDatePicker}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    fullWidth
                    variant="filled"
                    name="email"
                    type="text"
                    label="Email"
                    onFormat={formatLowerCaseTrim}
                    component={FormattedTextField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    fullWidth
                    variant="filled"
                    name="phoneNumber"
                    type="text"
                    label="Handy"
                    onFormat={formatPhoneNumberCountryCode}
                    component={FormattedTextField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    fullWidth
                    variant="filled"
                    name="advertisedThrough"
                    type="text"
                    label="Aufmerksam geworden"
                    select
                    component={TextField}
                  >
                    {enumKeys(CaAdvertisedThroughType).map(key => (
                      <MenuItem key={key} value={CaAdvertisedThroughType[key]}>
                        <AdvertisedThrough>
                          {CaAdvertisedThroughType[key]}
                        </AdvertisedThrough>
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid item xs={12} md={6}>
                  {values.advertisedThrough ===
                    CaAdvertisedThroughType.RECOMMENDATION && (
                    <Field
                      fullWidth
                      variant="filled"
                      name="recommendationClaim"
                      type="text"
                      label="Wer hat dich empfohlen?"
                      component={TextField}
                    />
                  )}
                </Grid>
                {businessUnits != null && businessUnits.length > 1 && (
                  <>
                    <Grid item xs={12}>
                      <Typography
                        style={{ marginTop: 16 }}
                        variant="h6"
                        component="p"
                        align="center"
                      >
                        Mein gewünschter Einsatzort:
                      </Typography>
                      <div className={classes.chips}>
                        {enumKeys(CaBusinessUnitType)
                          .filter(
                            key =>
                              CaBusinessUnitType[key] !==
                                CaBusinessUnitType.UNKNOWN &&
                              businessUnits.includes(CaBusinessUnitType[key])
                          )
                          .map(key => (
                            <Chip
                              key={key}
                              color={
                                values.businessUnit === CaBusinessUnitType[key]
                                  ? "primary"
                                  : "default"
                              }
                              onClick={() =>
                                setFieldValue(
                                  "businessUnit",
                                  CaBusinessUnitType[key]
                                )
                              }
                              label={
                                <BusinessUnit>
                                  {CaBusinessUnitType[key]}
                                </BusinessUnit>
                              }
                            ></Chip>
                          ))}
                      </div>
                      {errors.businessUnit && (
                        <FormHelperText
                          error
                          style={{ textAlign: "center" }}
                          className={classes.errorlabel}
                        >
                          {errors.businessUnit}
                        </FormHelperText>
                      )}
                    </Grid>
                  </>
                )}

                {!noLegal && (
                  <>
                    <Grid item xs={12} className={classes.checkboxTop}>
                      <Field
                        color="primary"
                        name="disclaimerConfirmed"
                        component={FormControlCheckbox}
                        label={
                          <Typography variant="body2" color="textSecondary">
                            Ich bin damit einverstanden, dass die Bearbeitung
                            und Verwaltung meiner Bewerbungsdaten über den
                            externen Dienstleister Signature CP UG
                            (haftungsbeschränkt) erfolgt. Die
                            Datenschutzhinweise von Signature findest du{" "}
                            <Link href="https://signatureapp.de/privacy">
                              hier
                            </Link>
                            .
                          </Typography>
                        }
                      />
                      <Field
                        color="primary"
                        name="contactConfirmed"
                        component={FormControlCheckbox}
                        label={
                          <Typography variant="body2" color="textSecondary">
                            Apollon darf mich telefonisch und per Email
                            kontaktieren.
                          </Typography>
                        }
                      />
                    </Grid>
                  </>
                )}
              </Grid>
              {errorMessage && (
                <FormHelperText error className={classes.errorlabel}>
                  {errorMessage}
                </FormHelperText>
              )}

              <SubmitButton
                fullWidth
                isSubmitting={isSubmitting}
                onClick={submitForm}
              >
                {submitText}
              </SubmitButton>
            </Form>
          ) : (
            <React.Fragment>
              <Box display="flex" justifyContent="center">
                <Typography variant="h5" gutterBottom align="center">
                  <DraftsTwoTone fontSize="large" />
                </Typography>
              </Box>
              <Box display="flex" justifyContent="center">
                <Typography variant="h5" gutterBottom align="center">
                  Bitte bestätige deine
                  <br /> Email-Adresse
                </Typography>
              </Box>
              <Box display="flex" justifyContent="center">
                <Typography variant="body1" align="center">
                  Fast geschafft! Bitte öffne jetzt die Bestätigungsmail in
                  deinem Email-Postfach und klicke den Bestätigungslink.
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="center"
                className={classes.gutterTop}
              >
                {user && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      resetForm();
                      setApplied(false);
                    }}
                  >
                    zurück
                  </Button>
                )}
              </Box>
            </React.Fragment>
          )
        }
      </Formik>
    </React.Fragment>
  );
};
