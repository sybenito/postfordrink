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
  onSnapshot,
} from "firebase/firestore";
import { message } from "antd";
import type { UserType } from "src/models/user";
import AuthContext from "src/store/auth-context";

interface AlcoholType {
  id?: string;
  name: string;
  canDouble: boolean;
  available?: boolean;
}

interface MixerType {
  id?: string;
  name: string;
  available?: boolean;
}

interface GarnishType {
  id?: string;
  name: string;
  available?: boolean;
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

  const db = getFirestore();

  const getExistingOrder = useCallback(() => {
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

        const orderSnapshot = snapshot.docs[0].data() as OrderType;
        orderSnapshot.drinks.forEach((d: DrinkType) => {
          dispatchOrder({ type: "ADD_DRINK", payload: d });
        });

        setOrderId(snapshot.docs[0].id);

        const docRef = doc(db, "orders", snapshot.docs[0].id as string);
        onSnapshot(docRef, (os) => {
          if (os.exists()) {
            const orderData = os.data() as OrderType;

            if (orderData.completedBy) {
              if (orderData.status === "completed") {
                setOrderId(null);
                setOrderLoaded(null);
                dispatchOrder({ type: "RESET_ORDER", payload: null });
                message.success("Order completed", 3);
              } else {
                setOrderLoaded(orderData);
                message.success(`Order taken by ${orderData.completedBy.name}`, 3);
              }

              if (navigator.vibrate) {
                navigator.vibrate(100);
              }
            } else {
              setOrderLoaded(orderData);
            }
          }
        });

        setOrderLoaded(orderSnapshot);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsOrderLoading(false);
      });
  }, [user, db]);

  const getOrderById = useCallback(async () => {
    const docRef = doc(db, "orders", orderId as string);
    const updatedViewer = {
      completedBy: {
        id: user.id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
      },
    };

    setIsOrderLoading(true);
    await updateDoc(docRef, updatedViewer);
    await getDoc(docRef)
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
  }, [orderId, user, db]);

  const getOrderHistory = useCallback(() => {
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
  }, [user, db]);

  const completeOrderLoaded = useCallback(() => {
    const docRef = doc(db, "orders", orderId as string);
    const updatedStatus = {
      status: "completed",
    };

    setIsSaving(true);
    updateDoc(docRef, updatedStatus)
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
  }, [orderId, db]);

  const cancelOrderLoaded = useCallback(() => {
    const docRef = doc(db, "orders", orderId as string);
    const updatedStatus = { completedBy: null };

    updateDoc(docRef, updatedStatus)
      .then(() => {
        setOrderId(null);
        setOrderLoaded(null);
      })
      .catch((e) => {
        message.error("There was an issue cancelling the order. Please contact the host.", 5);
        console.error(e);
      });
  }, [orderId, db]);

  const cancelOrder = useCallback(() => {
    const docRef = doc(db, "orders", orderId as string);
    const updatedStatus = { status: "cancelled" };

    setIsSaving(true);
    updateDoc(docRef, updatedStatus)
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
  }, [orderId, db]);

  const getAlcohol = useCallback(() => {
    const alcoholQuery = query(collection(db, "alcohol_type"));
    const alcoholList: AlcoholType[] = [];

    getDocs(alcoholQuery)
      .then((snapshot) => {
        snapshot.docs.forEach((d) => {
          const newAlcohol: AlcoholType = {
            id: d.id,
            name: d.data().name,
            canDouble: d.data().can_double,
            available: d.data().available,
          };

          alcoholList.push(newAlcohol);
        });

        setAlcohol(alcoholList);
      })
      .catch((e) => console.error(e));
  }, [db]);

  const getMixer = useCallback(() => {
    const mixerQuery = query(collection(db, "mixer_type"));
    const mixerList: MixerType[] = [];

    getDocs(mixerQuery)
      .then((snapshot) => {
        snapshot.docs.forEach((d) => {
          const newMixer: MixerType = {
            id: d.id,
            name: d.data().name,
            available: d.data().available,
          };
          mixerList.push(newMixer);
        });

        setMixer(mixerList);
      })
      .catch((e) => console.error(e));
  }, [db]);

  const getGarnish = useCallback(() => {
    const garnishQuery = query(collection(db, "garnish_type"));
    const garnishList: GarnishType[] = [];

    getDocs(garnishQuery)
      .then((snapshot) => {
        snapshot.docs.forEach((d) => {
          const newGarnish: GarnishType = {
            id: d.id,
            name: d.data().name,
            available: d.data().available,
          };
          garnishList.push(newGarnish);
        });

        setGarnish(garnishList);
      })
      .catch((e) => console.error(e));
  }, [db]);

  const saveOrder = useCallback(() => {
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
  }, [order, user, db]);

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
    cancelOrder,
    getOrderById,
    setOrderId,
    setOrderLoaded,
    completeOrderLoaded,
    cancelOrderLoaded,
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
