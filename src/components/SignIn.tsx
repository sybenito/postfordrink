import React, { useContext, useEffect } from "react";
import type { FC } from "react";
import { Button, Avatar } from "antd";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebase/compat/auth";
import AuthContext from "../store/auth-context";

import type { AuthContextType } from "../hooks/Auth";

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
  const { user } = useContext<AuthContextType>(AuthContext);

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
