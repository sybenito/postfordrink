import React, { useEffect, useState, useCallback } from "react";
import type { FC } from "react";
import { message } from "antd";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, updateProfile } from "firebase/auth";
import RegisterEmail from "src/components/RegisterEmail";
import type { RegistrationType } from "src/components/RegisterEmail";

const REDIRECT_SECONDS = 5;
const REGISTER_URL = `${window.location.href}registered`;

const auth = getAuth();

const RegisteredPage: FC = () => {
  const [redirectCount, setRedirectCount] = useState<number | null>(null);
  const [showEmailInput, setShowEmailInput] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  const completeSignIn = useCallback((registration: RegistrationType): void => {
    setIsSigningIn(true);
    signInWithEmailLink(auth, registration.email, REGISTER_URL)
      .then((p) => {
        // console.log("SIGN IN", p);
        if (auth.currentUser) {
          updateProfile(auth.currentUser, { displayName: registration.name });
        }

        window.localStorage.removeItem("emailForSignIn");
        setRedirectCount(REDIRECT_SECONDS);
        setShowEmailInput(false);
      })
      .catch((e) => {
        console.error(e);
        message.error("Error signing in with email link.  Please contact an administrator.");
      })
      .finally(() => {
        setIsSigningIn(false);
      });
  }, []);

  useEffect(() => {
    if (redirectCount === 0) setTimeout((): void => window.location.replace("/"), 1500);
    if (redirectCount) {
      const interval = setTimeout((): void => {
        setRedirectCount(redirectCount - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [redirectCount]);

  useEffect(() => {
    if (isSignInWithEmailLink(auth, REGISTER_URL)) {
      const emailForSignIn: string | null = window.localStorage.getItem("emailForSignIn");
      const registration: RegistrationType | null = emailForSignIn ? JSON.parse(emailForSignIn) : null;

      if (registration) completeSignIn(registration);
      else setShowEmailInput(true);
    }
  }, [completeSignIn]);

  return (
    <div id="registered">
      {!showEmailInput && redirectCount !== null && (
        <div className="registration-complete">
          <h1>Your registration is complete!</h1>
          <h3>You will be redirected to the party in:</h3>
          <div className="counter">
            {redirectCount > 0 && <div className="count">{redirectCount}</div>}
            {redirectCount === 0 && <div className="count">Let&apos;s Go!</div>}
          </div>
        </div>
      )}
      {showEmailInput && (
        <div className="email-input">
          <h3>Enter your email address to confirm your registration</h3>
          <RegisterEmail handleSubmit={completeSignIn} isLoading={isSigningIn} />
        </div>
      )}
    </div>
  );
};

export default RegisteredPage;
