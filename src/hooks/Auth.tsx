import { useState, useEffect, useCallback } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getFirestore, getDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { UserType, UserTypeEnum } from "src/models/user";
import FIREBASE_CONFIG from "src/secrets";

const BASE_TICKET_AMOUNT = 2;

const userInitState: UserType = {
  id: "",
  createdAt: null,
  name: "",
  email: "",
  photoURL: "",
  type: UserTypeEnum.DEFAULT,
  tickets: BASE_TICKET_AMOUNT,
};

interface AuthContextType {
  isSignedIn: boolean | null;
  user: UserType;
  fb: firebase.app.App | null;
  isUserLoading: boolean;
}

const fbInit: firebase.app.App = firebase.initializeApp(FIREBASE_CONFIG);

const useAuth = (): AuthContextType => {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<UserType>(userInitState);
  const [fb, setFb] = useState<firebase.app.App | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const createGuestUser = async (newUser: UserType) => {
    const db = getFirestore();
    setDoc(doc(db, "users", newUser.id), newUser);
  };

  const getUser = useCallback(async (authUser: firebase.User | null) => {
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
          createdAt: serverTimestamp(),
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
  }, []);

  useEffect(() => {
    setFb(fbInit);

    firebase.auth().onAuthStateChanged((authUser: firebase.User | null) => {
      setIsSignedIn(!!authUser);
      if (authUser) {
        getUser(authUser);
      }
    });
  }, [getUser]);

  return { isSignedIn, user, fb, isUserLoading };
};

export default useAuth;
export { userInitState };
export type { AuthContextType, UserType };
