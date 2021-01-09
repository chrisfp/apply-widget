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

export const firebaseConfig =
  firebaseConfigs[
    process.env.REACT_APP_GCLOUD_PROJECT as keyof typeof firebaseConfigs
  ];

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firebaseApply = async (
  applyData: ApplyFormValues,
  user?: CaUser
) => {
  const functions = firebase.app().functions(`${process.env.REACT_APP_REGION}`);
  const applyCallable = functions.httpsCallable("apply");
  return await applyCallable({
    ...applyData,
    ...(user ? { recruitedBy: extractUserPublicSnippet(user) } : {})
  });
};
const root = document.getElementById("streetcampaign-apply-widget");
const companyId = root?.dataset?.companyId;

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {companyId ? (
      <App companyId={companyId} />
    ) : (
      <p>
        Please pass a valid company to the #streetcampaign-apply-widget element
        using the attribute data-company-id="..."
      </p>
    )}
  </ThemeProvider>,
  document.querySelector("#streetcampaign-apply-widget")
);
