import React, { useEffect, useState } from "react";
import type { FC } from "react";
import { message } from "antd";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import RegisterEmail from "src/components/RegisterEmail";

const REDIRECT_SECONDS = 4;
const AUTH = getAuth();
const REGISTER_URL = `${window.location.href}registered`;

const RegisteredPage: FC = () => {
  const [redirectCount, setRedirectCount] = useState<number | null>(null);
  const [showEmailInput, setShowEmailInput] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  const completeSignIn = (email: string): void => {
    setIsSigningIn(true);
    signInWithEmailLink(AUTH, email, REGISTER_URL)
      .then(() => {
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
  };

  const handleSubmit = (email: string) => completeSignIn(email);

  useEffect(() => {
    if (redirectCount === 0) setTimeout((): void => window.location.replace("/"), 2000);
    if (redirectCount) {
      const interval = setTimeout((): void => {
        setRedirectCount(redirectCount - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [redirectCount]);

  useEffect(() => {
    if (isSignInWithEmailLink(AUTH, REGISTER_URL)) {
      const email: string | null = window.localStorage.getItem("emailForSignIn");

      if (email) completeSignIn(email);
      else setShowEmailInput(true);
    }
  }, []);

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
          <RegisterEmail handleSubmit={handleSubmit} isLoading={isSigningIn} />
        </div>
      )}
    </div>
  );
};

export default RegisteredPage;
