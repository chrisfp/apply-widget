import { DraftsTwoTone } from "@mui/icons-material";
import {
  Alert,
  Box,
  Chip,
  FormHelperText,
  Grid,
  Link,
  MenuItem,
  Typography
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { addYears } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { Field, Form, Formik, FormikProps } from "formik";
import { TextField } from "formik-mui";
import parsePhoneNumberFromString from "libphonenumber-js";
import React, { useEffect, useRef, useState } from "react";
import * as yup from "yup";

import { FormattedTextField } from "../atoms/FormattedTextField";
import { FormControlCheckbox } from "../atoms/FormControlCheckbox";
import { FormikDatePickerDate } from "../atoms/FormikDatePickerDate";
import { SubmitButton } from "../atoms/SubmitButton";
import {
  formatCapitalizeFirst,
  formatLowerCaseTrim,
  formatPhoneNumberCountryCode
} from "../formatters";
import { firebaseApply, firebaseCompanyDetailsFetch } from "../index";

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
      is: "Empfehlung",
      then: yup
        .string()
        .required("Name und/oder Fundraising-Nummer erforderlich")
    }),
    phoneNumber: yup
      .string()
      .trim()
      .min(4)
      .required("Pflichtfeld")
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
              "Das Akzeptieren der AGBs und Datenschutzhinweise ist erforderlich."
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
      .min(new Date(1900, 0, 1), "Format: TT.MM.YYYY")
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
  fixBorders: {
    "& input": {
      color: `${theme.palette.text.primary} !important`,
      backgroundColor: `transparent !important`,
      border: `none !important`,
      fontSize: 14,
      height: "58px !important",
      boxSizing: "border-box",
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
  businessUnit: string;
  phoneNumber: string;
  disclaimerConfirmed: boolean;
  contactConfirmed: boolean;
  city: string;
  dateOfBirth: Date | null;
  companyId: string;
}

interface ApplyFormFormikProps {
  noLegal?: boolean;
  submitText?: string;
  companyId: string;
  redirect?: string;
  businessUnits?: string[];
  onSubmit?: (values: ApplyFormValues) => void;
}

export const ApplyForm = ({
  noLegal,
  companyId,
  businessUnits: businessUnitsPreselection = [],
  redirect = "",
  submitText = "Jetzt Bewerben!",
  onSubmit
}: ApplyFormFormikProps) => {
  const [initialValues, setInitialValues] = useState<ApplyFormValues>({
    firstName: "",
    advertisedThrough: "",
    recommendationClaim: "",
    city: "",
    dateOfBirth: null,
    lastName: "",
    email: "",
    businessUnit: "",
    phoneNumber: "",
    disclaimerConfirmed: false,
    contactConfirmed: false,
    companyId
  });

  let formikRef = useRef<FormikProps<any>>();
  const nameField = useRef<HTMLInputElement | null>(null);
  const [applied, setApplied] = useState(false);
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = useState("");
  const [jobPortals, setJobPortals] = useState<string[]>([]);
  const [businessUnits, setBusinessUnits] = useState([""]);

  useEffect(() => {
    async function getData() {
      const data = await firebaseCompanyDetailsFetch(companyId);
      if (data) {
        const filteredBusinessUnits = data.businessUnits.filter(unit =>
          businessUnitsPreselection.some(filterUnit => filterUnit === unit)
        );
        setBusinessUnits(filteredBusinessUnits);
        if (filteredBusinessUnits.length === 1) {
          setInitialValues({
            ...initialValues,
            businessUnit: filteredBusinessUnits[0]
          });
        }
      }
    }
    if (companyId) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);
  useEffect(() => {
    async function getData() {
      const data = await firebaseCompanyDetailsFetch(companyId);
      if (data) {
        const { jobPortals } = data;
        const newData = { jobPortals };
        setJobPortals(newData.jobPortals);
      }
    }
    if (companyId) {
      getData();
    }
  }, [companyId]);
  return (
    <React.Fragment>
      <Formik
        innerRef={formikRef as any}
        initialValues={initialValues}
        enableReinitialize
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
          if (!values.dateOfBirth) {
            throw new Error("dateOfBirth missing");
          }
          try {
            await firebaseApply({
              ...values,
              dateOfBirth: Timestamp.fromDate(values.dateOfBirth)
            });
            onSubmit?.(values);
            setApplied(true);
            if (redirect) {
              window.location.replace(redirect);
            }
          } catch (e) {
            const error: any = e;
            if (
              error.message === "Die E-Mail Adresse ist bereits registriert"
            ) {
              setFieldError("email", error.message);
            } else if (error.message === "Ungültige E-Mail Adresse") {
              setFieldError("email", error.message);
            } else if (
              error.message === "Die Handynummer ist bereits registriert"
            ) {
              setFieldError("phoneNumber", error.message);
            } else if (error.message === "Ungültige Handynummer") {
              setFieldError("phoneNumber", error.message);
            } else if (error.code === "unknown") {
              setErrorMessage(`Unbekannter Fehler: ${error.message}`);
            } else {
              // eslint-disable-next-line no-console
              console.error(`${error}`);
              setErrorMessage(`Unbekannter Fehler: ${error}`);
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
                    name="dateOfBirth"
                    fullWidth
                    maxDate={addYears(new Date(), -17)}
                    maxDateMessage="Mindestalter: 17 Jahre"
                    invalidDateMessage="Ungültiges Datum"
                    label="Geburtsdatum"
                    autoComplete="no"
                    component={FormikDatePickerDate}
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
                    {Object.values(jobPortals).map((value: string) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid item xs={12} md={6}>
                  {values.advertisedThrough === "Empfehlung" && (
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
                        {businessUnits.map(businessUnit => (
                          <Chip
                            key={businessUnit}
                            color={
                              values.businessUnit === businessUnit
                                ? "primary"
                                : "default"
                            }
                            onClick={() =>
                              setFieldValue("businessUnit", businessUnit)
                            }
                            label={businessUnit}
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
                    <Grid item xs={12}>
                      <Field
                        color="primary"
                        name="disclaimerConfirmed"
                        component={FormControlCheckbox}
                        label={
                          <Typography variant="body2" color="textSecondary">
                            Ich bin damit einverstanden, dass die Bearbeitung
                            und Verwaltung meiner Bewerbungsdaten über den
                            externen Dienstleister Signature F2F GmbH erfolgt.
                            Die Datenschutzhinweise von Signature findest du{" "}
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
                <Alert sx={{ mb: 3, mt: 4, pt: 1 }} severity="error">
                  {errorMessage}
                </Alert>
              )}

              <SubmitButton
                fullWidth
                isSubmitting={isSubmitting}
                onClick={() => {
                  console.log("1");
                  submitForm();
                }}
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
            </React.Fragment>
          )
        }
      </Formik>
    </React.Fragment>
  );
};
