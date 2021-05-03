import {
  Box,
  Button,
  FormHelperText,
  Grid,
  Link,
  makeStyles,
  MenuItem,
  Typography
} from "@material-ui/core";
import { DraftsTwoTone } from "@material-ui/icons";
import { addYears } from "date-fns";
import { Field, Form, Formik, FormikProps } from "formik";
import { TextField } from "formik-material-ui";
import React, { useRef, useState } from "react";
import * as yup from "yup";

import { AdvertisedThrough } from "../atoms/AdvertisedThrough";
import { FormControlCheckbox } from "../atoms/FormControlCheckbox";
import { SubmitButton } from "../atoms/SubmitButton";
import { firebaseApply } from "../index";
import { CaAdvertisedThroughType } from "../types/enums";
import { CaUser } from "../types/model";
import { enumKeys } from "../utils/helpers";
import { FormikKeyboardDatePicker } from "./FormikKeyboardDatePicker";

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
    recommendationClaim: yup.string().when("advertisedThrough", {
      is: CaAdvertisedThroughType.RECOMMENDATION,
      then: yup.string().required("Name und/oder Fundraisernummer erforderlich")
    }),
    phoneNumber: yup
      .string()
      .trim()
      .required("Pflichtfeld"),

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
      .object()
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
    "& .MuiFormControlLabel-root": {
      alignItems: "start"
    },
    "& .MuiCheckbox-root": {
      marginTop: -theme.spacing(1)
    }
  },
  fixBorders: {
    "& .MuiInputBase-root input": {
      border: 0
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
  phoneNumber: string;
  disclaimerConfirmed: boolean;
  contactConfirmed: boolean;
  dateOfBirth?: firebase.firestore.Timestamp | null;
  city: string;
  companyId: string;
}

interface ApplyFormFormikProps {
  user?: CaUser;
  noLegal?: boolean;
  submitText?: string;
  companyId: string;
  onSubmit?: (values: ApplyFormValues) => void;
}

export const ApplyForm = ({
  user,
  noLegal,
  companyId,
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
          try {
            await firebaseApply(values);
            onSubmit?.(values);
            setApplied(true);
          } catch (error) {
            if (error.message === "Die Email Adresse ist bereits registriert") {
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
          return;
        }}
      >
        {({ submitForm, isSubmitting, resetForm, values }) =>
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
                    variant="outlined"
                    name="firstName"
                    type="text"
                    label="Vorname"
                    inputRef={nameField}
                    component={TextField}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    fullWidth
                    variant="outlined"
                    name="lastName"
                    type="text"
                    label="Nachname"
                    component={TextField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    fullWidth
                    variant="outlined"
                    name="city"
                    type="text"
                    label="Wohnort"
                    autoComplete="no"
                    component={TextField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    fullWidth
                    inputVariant="outlined"
                    name="dateOfBirth"
                    openTo="year"
                    views={["year", "month", "date"]}
                    maxDate={addYears(new Date(), -16)}
                    maxDateMessage="Mindestalter: 16 Jahre"
                    invalidDateMessage="Ungültiges Datum"
                    label="Geburtsdatum"
                    autoComplete="no"
                    component={FormikKeyboardDatePicker}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    fullWidth
                    variant="outlined"
                    name="email"
                    type="text"
                    label="Email"
                    component={TextField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    fullWidth
                    variant="outlined"
                    name="phoneNumber"
                    type="text"
                    label="Handy"
                    component={TextField}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    fullWidth
                    variant="outlined"
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
                      variant="outlined"
                      name="recommendationClaim"
                      type="text"
                      label="Wer hat dich empfohlen?"
                      component={TextField}
                    />
                  )}
                </Grid>

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
                            externen Dienstleister streetcampaign CP UG
                            (haftungsbeschränkt) erfolgt. Die
                            Datenschutzhinweise von streetcampaign findest du{" "}
                            <Link href="https://streetcampaign.de/data-protection">
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
