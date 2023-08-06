import React, { useEffect } from "react";
import type { FC } from "react";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebase/compat/auth";

import "firebaseui/dist/firebaseui.css";

// Configure FirebaseUI.
const uiConfig = {
  signInFlow: "popup",
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

const SignIn: FC = () => {
  useEffect(() => {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui-auth-container", uiConfig);
  }, []);

  return (
    <div className="sign-in">
      <div className="register">
        <h2>Join Up!</h2>
      </div>
      <div id="firebaseui-auth-container">
        <h3>Sign In</h3>
      </div>
    </div>
  );
};

export default SignIn;
