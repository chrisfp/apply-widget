import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/styles";
import { StyledEngineProvider, Theme } from "@mui/system";
import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import React from "react";
import ReactDOM from "react-dom";

import { App } from "./App";
import { firebaseConfigs } from "./firebase-config";
import { ApplyFormValues } from "./organisms/ApplyForm";
import { theme } from "./theme/theme";
import { CaCompany, CaUser, extractUserPublicSnippet } from "./types/model";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const head = document.getElementsByTagName("HEAD")[0];
const link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = "https://use.typekit.net/kio3qqb.css";

// Append link element to HTML head
head.appendChild(link);

const rootEl = document.getElementById("signature-apply-widget");
const apiKey = rootEl?.dataset?.apiKey;

console.log(process.env.REACT_APP_VERSION);

export const firebaseConfig = {
  ...firebaseConfigs[
    process.env.REACT_APP_GCP_PROJECT as keyof typeof firebaseConfigs
  ],
  apiKey
};

const httpFunctionsBaseUrl = process.env.REACT_APP_USE_EMULATOR
  ? `http://127.0.0.1:5005/${process.env.REACT_APP_GCP_PROJECT}/${process.env.REACT_APP_REGION}`
  : `https://signatureapp.de`;

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

export const functions = getFunctions(
  firebaseApp,
  process.env.REACT_APP_REGION
);

export const COLLECTION_COMPANIES = "companies";
export const db = getFirestore(firebaseApp);

export async function firebaseApply(
  applyData: Omit<ApplyFormValues, "dateOfBirth"> & {
    dateOfBirth: string;
  },
  user?: CaUser
) {
  const body = {
    ...applyData,
    ...(user ? { _recommendedBy: extractUserPublicSnippet(user) } : {})
  };
  const response = await fetch(`${httpFunctionsBaseUrl}/api/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const result = await response.json();
  if (response.ok) {
    return result;
  } else {
    throw result;
  }
}

export const firebaseCompanyDetailsFetch = async (companyId: string) => {
  const snapshot = await getDoc(
    doc(collection(db, COLLECTION_COMPANIES), companyId)
  );
  if (snapshot.exists()) {
    const companyRaw = snapshot.data();
    const company = {
      ...(companyRaw as CaCompany),
      companyId: snapshot.ref.id
    };
    return company;
  } else return null;
};

const redirect = rootEl?.dataset?.redirect;
const companyId = rootEl?.dataset?.companyId;
const businessUnits =
  rootEl?.dataset?.businessUnits && JSON.parse(rootEl?.dataset?.businessUnits);

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {companyId ? (
        <App
          companyId={companyId}
          businessUnits={businessUnits}
          redirect={redirect}
        />
      ) : (
        <p>
          Please pass a valid company to the #signature-apply-widget element
          using the attribute data-company-id="..."
        </p>
      )}
    </ThemeProvider>
  </StyledEngineProvider>,
  document.querySelector("#signature-apply-widget")
);
