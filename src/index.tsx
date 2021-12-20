import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import { initializeApp } from "firebase/app";
import { Timestamp } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
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
export const firebaseApp = initializeApp(firebaseConfig);

export const functions = getFunctions(
  firebaseApp,
  process.env.REACT_APP_REGION
);
export const firebaseApply = async (
  applyData: Omit<ApplyFormValues, "dateOfBirth"> & {
    dateOfBirth: Timestamp;
  },
  user?: CaUser
) => {
  const applyCallable = httpsCallable(functions, "apply");
  return await applyCallable({
    ...applyData,
    ...(user ? { _recommendedBy: extractUserPublicSnippet(user) } : {})
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
