import { useState, useEffect, useContext, useCallback } from "react";
import { getFirestore, getDoc, doc, setDoc } from "firebase/firestore";
import AuthContext from "../store/auth-context";

enum UserTypeEnums {
  HOST = "host",
  GUEST = "guest",
  BAR = "bar",
}

interface UserType {
  id: string;
  name: string;
  email: string;
  type: UserTypeEnums;
  tickets: number;
}

const BASE_TICKET_AMOUNT = 2;

const userInitState: UserType = {
  id: "",
  name: "",
  email: "",
  type: UserTypeEnums.GUEST,
  tickets: BASE_TICKET_AMOUNT,
};

const useUser = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user: authUser } = useContext(AuthContext);

  const getUser = useCallback(async () => {
    if (authUser) {
      setIsLoading(true);
      const db = getFirestore();
      const userRef = doc(db, "users", authUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUser(userDoc.data() as UserType);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }
  }, [authUser]);

  const createGuestUser = async (id: string, name: string, email: string) => {
    const db = getFirestore();
    setDoc(doc(db, "users", id), { ...userInitState, id, email, name });
  };

  useEffect(() => {
    getUser();
  }, [getUser]);

  return { user, isLoading, createGuestUser, getUser };
};

export default useUser;
export type { UserType };
