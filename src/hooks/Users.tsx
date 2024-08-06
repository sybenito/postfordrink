import { useState, useCallback, useEffect } from "react";
import { getFirestore, getDocs, query, collection, updateDoc, doc } from "firebase/firestore";
import { UserType } from "src/models/user";

const useUsers = () => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [userTypes, setUserTypes] = useState<string[]>([]);

  const db = getFirestore();

  const getUsers = useCallback(async () => {
    setIsSaving(true);
    const q = query(collection(db, "users"));

    getDocs(q)
      .then((querySnapshot) => {
        setUsers(querySnapshot.docs.map((d) => d.data()) as UserType[]);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsSaving(false);
      });
  }, [db]);

  const updateUser = useCallback(
    async (user: UserType) => {
      setIsSaving(true);
      const docRef = doc(db, "users", user.id);
      await updateDoc(docRef, { ...user })
        .then(() => {
          setIsSaving(false);
          getUsers();
        })
        .catch((e) => {
          console.error(e);
        });
    },
    [db, getUsers]
  );

  const getUserTypes = useCallback(async () => {
    const q = query(collection(db, "user_type"));

    getDocs(q)
      .then((querySnapshot) => {
        setUserTypes(querySnapshot.docs.map((d) => d.data().name) as string[]);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [db]);

  useEffect(() => {
    getUserTypes();
  }, [getUserTypes]);

  return { isSaving, users, getUsers, updateUser, userTypes };
};

export default useUsers;
