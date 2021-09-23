import "firebase/functions";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import firebase from "firebase/app";
import React from "react";
import ReactDOM from "react-dom";

import { App } from "./App";
import { firebaseConfigs } from "./firebase-config";
import { ApplyFormValues } from "./organisms/ApplyForm";
import { theme } from "./theme";
import { CaUser, extractUserPublicSnippet } from "./types/model";

const rootEl = document.getElementById("signature-apply-widget");
const apiKey = rootEl?.dataset?.apiKey;

export const firebaseConfig = {
  ...firebaseConfigs[
    process.env.REACT_APP_GCLOUD_PROJECT as keyof typeof firebaseConfigs
  ],
  apiKey
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firebaseApply = async (
  applyData: Omit<ApplyFormValues, "dateOfBirth"> & {
    dateOfBirth: firebase.firestore.Timestamp;
  },
  user?: CaUser
) => {
  const functions = firebase.app().functions(`${process.env.REACT_APP_REGION}`);
  const applyCallable = functions.httpsCallable("apply");
  return await applyCallable({
    ...applyData,
    ...(user ? { recruitedBy: extractUserPublicSnippet(user) } : {})
  });
};

const companyId = rootEl?.dataset?.companyId;
const businessUnits =
  rootEl?.dataset?.businessUnits && JSON.parse(rootEl?.dataset?.businessUnits);

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {companyId ? (
      <App companyId={companyId} businessUnits={businessUnits} />
    ) : (
      <p>
        Please pass a valid company to the #signature-apply-widget element using
        the attribute data-company-id="..."
      </p>
    )}
  </ThemeProvider>,
  document.querySelector("#signature-apply-widget")
);
