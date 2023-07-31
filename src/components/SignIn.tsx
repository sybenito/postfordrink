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
  const { isSignedIn, user } = useContext<AuthContextType>(AuthContext);

  useEffect(() => {
    if (!isSignedIn) {
      const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
      ui.start("#firebaseui-auth-container", uiConfig);
    }
  }, [isSignedIn]);

  if (!isSignedIn) {
    return <div id="firebaseui-auth-container">Signin</div>;
  }
  return (
    <div className="sign-out">
      <Button onClick={() => firebase.auth().signOut()}>Sign-out</Button>
      {user && <Avatar src={user.photoURL} />}
    </div>
  );
};

export default SignIn;
