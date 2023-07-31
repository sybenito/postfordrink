import React, { useContext } from "react";
import type { FC } from "react";
import { Button, Avatar } from "antd";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import AuthContext from "../store/auth-context";
import type { AuthContextType } from "../hooks/Auth";

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
  return (
    <div className="sign-out">
      <Button onClick={() => firebase.auth().signOut()}>Sign-out</Button>
      {user && <Avatar src={user.photoURL} />}
    </div>
  );
};

export default SignIn;
