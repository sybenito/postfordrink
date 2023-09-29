import { useState, useCallback, useReducer, useContext, useEffect } from "react";
import {
  getFirestore,
  doc,
  addDoc,
  serverTimestamp,
  FieldValue,
  query,
  collection,
  getDocs,
  getDoc,
  where,
  limit,
  updateDoc,
  orderBy,
} from "firebase/firestore";
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
  status: "pending" | "completed" | "cancelled";
  completedBy?: OrderUserType;
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
  const [orderHistory, setOrderHistory] = useState<OrderType[]>([]);
  const [alcohol, setAlcohol] = useState<AlcoholType[]>([]);
  const [mixer, setMixer] = useState<MixerType[]>([]);
  const [garnish, setGarnish] = useState<GarnishType[]>([]);
  const [order, dispatchOrder] = useReducer(reduceOrder, []);
  const [orderLoaded, setOrderLoaded] = useState<OrderType | null>(null);
  const [ticketsPending, setTicketsPending] = useState<number>(0);
  const [orderId, setOrderId] = useState<string | null>(null);

  const getExistingOrder = useCallback(() => {
    const db = getFirestore();
    const orderQuery = query(
      collection(db, "orders"),
      where("createdBy.id", "==", user.id),
      where("status", "==", "pending"),
      limit(1)
    );

    setIsOrderLoading(true);
    getDocs(orderQuery)
      .then((snapshot) => {
        if (snapshot.docs.length === 0) return;

        dispatchOrder({ type: "RESET_ORDER", payload: null });

        const orderDrinks = snapshot.docs[0].data().drinks;
        orderDrinks.forEach((d: DrinkType) => {
          dispatchOrder({ type: "ADD_DRINK", payload: d });
        });

        setOrderId(snapshot.docs[0].id);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsOrderLoading(false);
      });
  }, [user]);

  const getOrderById = useCallback(() => {
    const db = getFirestore();
    const docRef = doc(db, "orders", orderId as string);

    setIsOrderLoading(true);
    getDoc(docRef)
      .then((snapshot) => {
        if (!snapshot.exists()) {
          message.error("Order does not exist", 3);
          setOrderId(null);
          return;
        }
        const orderData = snapshot.data() as OrderType;
        setOrderLoaded(orderData);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsOrderLoading(false);
      });
  }, [orderId]);

  const getOrderHistory = useCallback(() => {
    const db = getFirestore();
    const historyQuery = query(
      collection(db, "orders"),
      where("createdBy.id", "==", user.id),
      where("status", "==", "completed"),
      orderBy("createdAt", "desc")
    );

    setIsHistoryLoading(true);
    getDocs(historyQuery)
      .then((snapshot) => {
        snapshot.docs.forEach((d) => {
          setOrderHistory((state) => [...state, d.data() as OrderType]);
        });
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsHistoryLoading(false);
      });
  }, [user]);

  const completeOrderLoaded = useCallback(() => {
    const db = getFirestore();
    const orderRef = doc(db, "orders", orderId as string);
    const updatedStatus = {
      status: "completed",
      completedBy: {
        id: user.id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
      },
    };

    setIsSaving(true);
    updateDoc(orderRef, updatedStatus)
      .then(() => {
        message.success("Order completed", 3);
        setIsSaving(false);
        setOrderId(null);
        setOrderLoaded(null);
      })
      .catch((e) => {
        message.error("There was an issue completing the order. Please contact the host.", 5);
        console.error(e);
      });
  }, [orderId, user]);

  const cancelOrderLoaded = useCallback(() => {
    const db = getFirestore();
    const orderRef = doc(db, "orders", orderId as string);
    const updatedStatus = { status: "cancelled" };

    setIsSaving(true);
    updateDoc(orderRef, updatedStatus)
      .then(() => {
        message.success("Order cancelled!", 5);
        setIsSaving(false);
        setOrderId(null);
        dispatchOrder({ type: "RESET_ORDER", payload: null });
      })
      .catch((e) => {
        message.error("There was an issue cancelling the order. Please contact the host.", 5);
        console.error(e);
      });
  }, [orderId]);

  const getAlcohol = useCallback(() => {
    const db = getFirestore();
    const alcoholQuery = query(collection(db, "alcohol_type"));
    const alcoholList: AlcoholType[] = [];

    getDocs(alcoholQuery)
      .then((snapshot) => {
        snapshot.docs.forEach((d) => {
          const newAlcohol: AlcoholType = {
            id: d.id,
            name: d.data().name,
            canDouble: d.data().can_double,
          };

          alcoholList.push(newAlcohol);
        });

        setAlcohol(alcoholList);
      })
      .catch((e) => console.error(e));
  }, []);

  const getMixer = useCallback(() => {
    const db = getFirestore();
    const mixerQuery = query(collection(db, "mixer_type"));
    const mixerList: MixerType[] = [];

    getDocs(mixerQuery)
      .then((snapshot) => {
        snapshot.docs.forEach((d) => {
          const newMixer: MixerType = {
            id: d.id,
            name: d.data().name,
          };
          mixerList.push(newMixer);
        });

        setMixer(mixerList);
      })
      .catch((e) => console.error(e));
  }, []);

  const getGarnish = useCallback(() => {
    const db = getFirestore();
    const garnishQuery = query(collection(db, "garnish_type"));
    const garnishList: GarnishType[] = [];

    getDocs(garnishQuery)
      .then((snapshot) => {
        snapshot.docs.forEach((d) => {
          const newGarnish: GarnishType = {
            id: d.id,
            name: d.data().name,
          };
          garnishList.push(newGarnish);
        });

        setGarnish(garnishList);
      })
      .catch((e) => console.error(e));
  }, []);

  const saveOrder = useCallback(() => {
    const db = getFirestore();
    const collectionRef = collection(db, "orders");
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

    setIsSaving(true);

    addDoc(collectionRef, newOrder)
      .then((docRef) => {
        setOrderId(docRef.id);
      })
      .catch((e) => {
        message.error("There was an issue completing the order. Please contact the host.", 5);
        console.error(e);
      })
      .finally(() => {
        setIsSaving(false);
      });
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
    getOrderHistory,
    cancelOrderLoaded,
    getOrderById,
    setOrderId,
    setOrderLoaded,
    completeOrderLoaded,
    alcohol,
    mixer,
    garnish,
    order,
    orderLoaded,
    ticketsPending,
    orderId,
    orderHistory,
    isSaving,
    isOrderLoading,
    isHistoryLoading,
  };
};

export default useOrder;
export type { DrinkType, AlcoholType, MixerType, GarnishType, OrderType };
