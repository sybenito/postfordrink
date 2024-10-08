import React, { useEffect, useState, useCallback, useRef } from "react";
import type { FC } from "react";
import { message } from "antd";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, updateProfile } from "firebase/auth";
import RegisterEmail from "src/components/RegisterEmail";
import type { RegistrationType } from "src/components/RegisterEmail";

const REDIRECT_SECONDS = 3;
const REGISTER_URL = `${window.location.href}registered`;

const auth = getAuth();

const RegisteredPage: FC = () => {
  const isSigninAction = useRef<boolean>(false);
  const [redirectCount, setRedirectCount] = useState<number | null>(null);
  const [showEmailInput, setShowEmailInput] = useState<boolean>(false);

  const completeSignIn = useCallback(async (registration: RegistrationType): Promise<void> => {
    isSigninAction.current = true;
    await signInWithEmailLink(auth, registration.email, REGISTER_URL)
      .then(() => {
        if (auth.currentUser) updateProfile(auth.currentUser, { displayName: registration.name });

        window.localStorage.removeItem("emailForSignIn");
        setRedirectCount(REDIRECT_SECONDS);
        setShowEmailInput(false);
      })
      .catch((e) => {
        console.error(e);
        message.error("Error signing in with email link.  Please try again.");
        document.location.href = "/";
      })
      .finally(() => {
        isSigninAction.current = false;
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
    if (isSignInWithEmailLink(auth, REGISTER_URL) && !isSigninAction.current) {
      const emailForSignIn: string | null = window.localStorage.getItem("emailForSignIn");
      const registration: RegistrationType | null = emailForSignIn ? JSON.parse(emailForSignIn) : null;

      if (registration) completeSignIn(registration);
      else setShowEmailInput(true);
    }
  }, [completeSignIn, isSigninAction]);

  return (
    <div id="registered" className="content-section">
      {!showEmailInput && redirectCount !== null && (
        <div className="registration-complete content-section text-center">
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
          <RegisterEmail handleSubmit={completeSignIn} isLoading={isSigninAction.current} />
        </div>
      )}
    </div>
  );
};

export default RegisteredPage;
