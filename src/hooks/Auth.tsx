import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { FIREBASE_CONFIG } from "../secrets";

const fbInit: firebase.app.App = firebase.initializeApp(FIREBASE_CONFIG);

function useAuth() {
  const [isSignedIn, setIsSignedIn] = useState(false);
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
}
export default useAuth;
