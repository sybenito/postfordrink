import React, { useState, useCallback, useReducer, useContext, useEffect } from "react";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  FieldValue,
  query,
  collection,
  getDocs,
  where,
  limit,
} from "firebase/firestore";
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
  status: "pending" | "completed";
}

const reduceOrder = (state: DrinkType[], action: { type: string; payload: DrinkType | number | null }) => {
  switch (action.type) {
    case "ADD_DRINK":
      state.push(action.payload as DrinkType);
      return [...state];
    case "REMOVE_DRINK":
      state.splice(action.payload as number, 1);
      return [...state];
    case "RESET_ORDER":
      return [];
    default:
      return state;
  }
};

const useOrder = () => {
  const { user } = useContext(AuthContext);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isOrderLoading, setIsOrderLoading] = useState<boolean>(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
  const [alcohol, setAlcohol] = useState<AlcoholType[]>([]);
  const [mixer, setMixer] = useState<MixerType[]>([]);
  const [garnish, setGarnish] = useState<GarnishType[]>([]);
  const [order, dispatchOrder] = useReducer(reduceOrder, []);
  const [ticketsPending, setTicketsPending] = useState<number>(0);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const getExistingOrder = useCallback(async () => {
    const db = getFirestore();
    const q = query(
      collection(db, "orders"),
      where("createdBy.id", "==", user.id),
      where("status", "==", "pending"),
      limit(1)
    );

    try {
      setIsOrderLoading(true);
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length === 0) return;

      dispatchOrder({ type: "RESET_ORDER", payload: null });

      const orderDrinks = querySnapshot.docs[0].data().drinks;
      orderDrinks.forEach((d: DrinkType) => {
        dispatchOrder({ type: "ADD_DRINK", payload: d });
      });

      setQrCode(querySnapshot.docs[0].id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsOrderLoading(false);
    }
  }, [user]);

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

  const saveOrder = useCallback(async () => {
    const db = getFirestore();
    const orderRef = doc(db, "orders", user.id);
    const newOrder: OrderType = {
      createdBy: {
        id: user.id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
      },
      createdAt: serverTimestamp(),
      drinks: order,
      status: "pending",
    };

    try {
      setIsSaving(true);
      await setDoc(orderRef, newOrder);
      message.success("Head over to the bar!", 5);
    } catch (e) {
      message.error("There was an issue completing the order. Please contact the host.", 5);
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  }, [order, user]);

  useEffect(() => {
    let ticketsTotal = 0;
    order.forEach((drink: DrinkType) => {
      if (drink.double === true) ticketsTotal += 2;
      else ticketsTotal += 1;
    });
    setTicketsPending(ticketsTotal);
  }, [order]);

  return {
    getAlcohol,
    getMixer,
    getGarnish,
    dispatchOrder,
    saveOrder,
    getExistingOrder,
    alcohol,
    mixer,
    garnish,
    order,
    ticketsPending,
    qrCode,
    isSaving,
    isOrderLoading,
  };
};

export default useOrder;
export type { DrinkType, AlcoholType, MixerType, GarnishType, OrderType };
