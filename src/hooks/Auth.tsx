import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { FIREBASE_CONFIG } from "../secrets";

interface AuthContextType {
  isSignedIn: boolean;
  user: firebase.User | null;
  fb: firebase.app.App | null;
}

const fbInit: firebase.app.App = firebase.initializeApp(FIREBASE_CONFIG);

const useAuth = (): AuthContextType => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [fb, setFb] = useState<firebase.app.App | null>(null);

  useEffect(() => {
    setFb(fbInit);

    const unregisterAuthObserver = firebase.auth().onAuthStateChanged((payload) => {
      setIsSignedIn(!!payload);
      if (payload) {
        setUser(payload);
      } else {
        setUser(null);
      }
    });
    return () => unregisterAuthObserver();
  }, []);

  return { isSignedIn, user, fb };
};

export default useAuth;
export type { AuthContextType };
