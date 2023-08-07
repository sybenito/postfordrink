import React, { useEffect, useState, useMemo } from "react";
import type { FC } from "react";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebase/compat/auth";
import { sendSignInLinkToEmail } from "firebase/auth";
import { message } from "antd";
import RegisterEmail from "src/components/RegisterEmail";

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
  const [isEmailRegistrationSent, setIsEmailRegistrationSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authUi, setAuthUi] = useState<firebaseui.auth.AuthUI | null>(null);
  const authUiMemo = useMemo(() => ({ authUi, setAuthUi }), [authUi, setAuthUi]);

  useEffect(() => {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
    setAuthUi(ui);
    ui.start("#firebaseui-auth-container", uiConfig);
  }, []);

  const handleEmailRegister = (email: string) => {
    setIsLoading(true);
    sendSignInLinkToEmail(firebase.auth(), email, {
      url: `${window.location.href}registered`,
      handleCodeInApp: true,
    })
      .then(() => {
        window.localStorage.setItem("emailForSignIn", email);
        authUiMemo.authUi?.reset();
        setIsEmailRegistrationSent(true);
      })
      .catch((e) => {
        console.error(e);
        message.error("Error registering your email.  Please contact an administrator.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="sign-in">
      {!isEmailRegistrationSent ? (
        <div id="firebaseui-auth-container">
          <h3>Sign In</h3>
          <RegisterEmail handleSubmit={handleEmailRegister} isLoading={isLoading} />
        </div>
      ) : (
        <div className="email-registration-sent">
          <p>Check your email to get your sign-in link</p>
        </div>
      )}
    </div>
  );
};

export default SignIn;
