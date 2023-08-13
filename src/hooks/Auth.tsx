import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getFirestore, getDoc, doc, setDoc } from "firebase/firestore";
import FIREBASE_CONFIG from "../secrets";

enum UserTypeEnums {
  HOST = "host",
  GUEST = "guest",
  BAR = "bar",
}

interface UserType {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  type: UserTypeEnums;
  tickets: number;
}

const BASE_TICKET_AMOUNT = 2;

const userInitState: UserType = {
  id: "",
  name: "",
  email: "",
  photoURL: "",
  type: UserTypeEnums.GUEST,
  tickets: BASE_TICKET_AMOUNT,
};

interface AuthContextType {
  isSignedIn: boolean | null;
  user: UserType | null;
  fb: firebase.app.App | null;
  isUserLoading: boolean;
}

const fbInit: firebase.app.App = firebase.initializeApp(FIREBASE_CONFIG);

const useAuth = (): AuthContextType => {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [fb, setFb] = useState<firebase.app.App | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const createGuestUser = async (newUser: UserType) => {
    const db = getFirestore();
    setDoc(doc(db, "users", newUser.id), newUser);
  };

  const getUser = async (authUser: firebase.User | null) => {
    if (authUser) {
      setIsUserLoading(true);
      const db = getFirestore();
      const userRef = doc(db, "users", authUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUser(userDoc.data() as UserType);
      } else {
        const newUser: UserType = {
          ...userInitState,
          id: authUser.uid,
          email: authUser.email || "",
          name: authUser.displayName || "",
          photoURL: authUser.photoURL || "",
        };
        await createGuestUser(newUser)
          .then(() => setUser(newUser))
          .catch((e) => console.error("Error creating new guest: ", e));
      }
      setIsUserLoading(false);
    }
  };

  useEffect(() => {
    setFb(fbInit);

    const authChangeObserver = firebase.auth().onAuthStateChanged((authUser: firebase.User | null) => {
      setIsSignedIn(!!authUser);
      if (authUser) {
        getUser(authUser);
      }
    });
    return () => authChangeObserver();
  }, [getUser]);

  return { isSignedIn, user, fb, isUserLoading };
};

export default useAuth;
export type { AuthContextType, UserType };
