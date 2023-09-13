import React, { useState, useCallback, useReducer, useContext } from "react";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";
import { getFirestore, doc, setDoc, serverTimestamp, FieldValue, query, collection, getDocs } from "firebase/firestore";
import type { QueryDocumentSnapshot } from "firebase/firestore";
import { message } from "antd";
import type { UserType } from "src/hooks/Auth";
import AuthContext from "src/store/auth-context";

interface AlcoholType {
  id: string;
  name: string;
  canDouble: boolean;
}

interface MixerType {
  id: string;
  name: string;
}

interface GarnishType {
  id: string;
  name: string;
}

type OrderUserType = Omit<UserType, "type" | "tickets">;

interface OrderType {
  createdBy: OrderUserType;
  createdAt: FieldValue | null;
  request: string;
  order: string[][];
}

const reduceAlcoholFn = (state: AlcoholType[], action: { type: string; payload: QueryDocumentSnapshot }) => {
  const alcohol: AlcoholType = {
    id: action.payload.id,
    name: action.payload.data().name,
    canDouble: action.payload.data().canDouble,
  };

  switch (action.type) {
    case "ADD":
      return [...state, alcohol];
    case "REMOVE":
      return state.filter((a) => a.id !== action.payload.id);
    default:
      return state;
  }
};

const reduceMixerGarnishFn = (
  state: MixerType[] | GarnishType[],
  action: { type: string; payload: QueryDocumentSnapshot }
) => {
  const mixerGarnish: MixerType | GarnishType = {
    id: action.payload.id,
    name: action.payload.data().name,
  };

  switch (action.type) {
    case "ADD":
      return [...state, mixerGarnish];
    case "REMOVE":
      return state.filter((a) => a.id !== action.payload.id);
    default:
      return state;
  }
};

const storage: FirebaseStorage = getStorage();

const usePhoto = () => {
  const { user } = useContext(AuthContext);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
  const [alcohol, reduceAlcohol] = useReducer(reduceAlcoholFn, []);
  const [mixer, reduceMixer] = useReducer(reduceMixerGarnishFn, []);
  const [garnish, reduceGarnish] = useReducer(reduceMixerGarnishFn, []);
  const [order, setOrder] = useState<OrderType[]>([]);

  const getAlcohol = useCallback(async () => {
    const db = getFirestore();
    const q = query(collection(db, "alcohol_type"));
    const querySnapshot = await getDocs(q);

    querySnapshot.docs.forEach((d) => {
      reduceAlcohol({ type: "ADD", payload: d });
    });
  }, []);

  const getMixer = useCallback(async () => {
    const db = getFirestore();
    const q = query(collection(db, "mixer_type"));
    const querySnapshot = await getDocs(q);

    querySnapshot.docs.forEach((d) => {
      reduceMixer({ type: "ADD", payload: d });
    });
  }, []);

  const getGarnish = useCallback(async () => {
    const db = getFirestore();
    const q = query(collection(db, "garnish_type"));
    const querySnapshot = await getDocs(q);

    querySnapshot.docs.forEach((d) => {
      reduceGarnish({ type: "ADD", payload: d });
    });
  }, []);

  return { getAlcohol, getMixer, getGarnish, alcohol, mixer, garnish, order };
};

export default usePhoto;
