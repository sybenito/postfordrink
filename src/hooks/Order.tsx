import React, { useState, useCallback, useReducer, useContext, useEffect } from "react";
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

interface DrinkType {
  alcohol: AlcoholType | null;
  mixer: MixerType[];
  garnish: GarnishType[];
  double: boolean;
  request: string;
}

interface OrderType {
  createdBy: OrderUserType;
  createdAt: FieldValue | null;
  drinks: DrinkType[];
}

const initOrder: OrderType = {
  createdBy: {
    id: "",
    name: "",
    email: "",
    photoURL: "",
  },
  createdAt: null,
  drinks: [],
};

const reduceOrder = (state: OrderType, action: { type: string; payload: DrinkType | number }) => {
  switch (action.type) {
    case "ADD":
      state.drinks.push(action.payload as DrinkType);
      return state;
    case "REMOVE":
      state.drinks.splice(action.payload as number, 1);
      return state;
    default:
      return state;
  }
};

const useOrder = () => {
  const { user } = useContext(AuthContext);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
  const [alcohol, setAlcohol] = useState<AlcoholType[]>([]);
  const [mixer, setMixer] = useState<MixerType[]>([]);
  const [garnish, setGarnish] = useState<GarnishType[]>([]);
  const [order, dispatchOrder] = useReducer(reduceOrder, initOrder);

  const getAlcohol = useCallback(async () => {
    const db = getFirestore();
    const q = query(collection(db, "alcohol_type"));
    const querySnapshot = await getDocs(q);
    const alcoholList: AlcoholType[] = [];

    querySnapshot.docs.forEach((d) => {
      const newAlcohol: AlcoholType = {
        id: d.id,
        name: d.data().name,
        canDouble: d.data().can_double,
      };

      alcoholList.push(newAlcohol);
    });

    setAlcohol(alcoholList);
  }, []);

  const getMixer = useCallback(async () => {
    const db = getFirestore();
    const q = query(collection(db, "mixer_type"));
    const querySnapshot = await getDocs(q);
    const mixerList: MixerType[] = [];

    querySnapshot.docs.forEach((d) => {
      const newMixer: MixerType = {
        id: d.id,
        name: d.data().name,
      };
      mixerList.push(newMixer);
    });

    setMixer(mixerList);
  }, []);

  const getGarnish = useCallback(async () => {
    const db = getFirestore();
    const q = query(collection(db, "garnish_type"));
    const querySnapshot = await getDocs(q);
    const garnishList: GarnishType[] = [];

    querySnapshot.docs.forEach((d) => {
      const newGarnish: GarnishType = {
        id: d.id,
        name: d.data().name,
      };
      garnishList.push(newGarnish);
    });

    setGarnish(garnishList);
  }, []);

  return { getAlcohol, getMixer, getGarnish, dispatchOrder, alcohol, mixer, garnish, order };
};

export default useOrder;
export type { DrinkType, AlcoholType, MixerType, GarnishType, OrderType };
