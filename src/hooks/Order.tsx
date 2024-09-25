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

interface CocktailType {
  id?: string;
  name: string;
  available?: boolean;
  description: string;
}

type OrderUserType = Omit<UserType, "type" | "tickets">;

interface DrinkType {
  cocktail: CocktailType | null;
  alcohol: AlcoholType | null;
  mixer: MixerType[];
  garnish: GarnishType[];
  double: boolean;
  request: string;
}

interface OrderType {
  id: string;
  createdBy: OrderUserType;
  createdAt: FieldValue;
  drinks: DrinkType[];
  status: OrderTypeStatus;
  completedBy?: OrderUserType;
  updatedAt: FieldValue;
}

type OrderTypeStatus = "new" | "pending" | "completed" | "cancelled";

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
  const [cocktail, setCocktail] = useState<CocktailType[]>([]);
  const [alcohol, setAlcohol] = useState<AlcoholType[]>([]);
  const [mixer, setMixer] = useState<MixerType[]>([]);
  const [garnish, setGarnish] = useState<GarnishType[]>([]);
  const [order, dispatchOrder] = useReducer(reduceOrder, []);
  const [orderLoaded, setOrderLoaded] = useState<OrderType | null>(null);
  const [ticketsPending, setTicketsPending] = useState<number>(0);
  const [newOrders, setNewOrders] = useState<OrderType[]>([]);
  const [completedOrders, setCompletedOrders] = useState<OrderType[]>([]);
  const [newOrderCount, setNewOrderCount] = useState<number>(0);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState<boolean>(false);

  const db = getFirestore();

  const getOrders = useCallback(
    (status: OrderTypeStatus) => {
      const sortCrit = status === "completed" ? "updatedAt" : "createdAt";
      const sortDir = status === "completed" ? "desc" : "asc";
      let ordersQuery = query(collection(db, "orders"), orderBy(sortCrit, sortDir));
      if (status) ordersQuery = query(ordersQuery, where("status", "==", status));

      setIsOrderLoading(true);

      onSnapshot(
        ordersQuery,
        (querySnapshot) => {
          const newOrdersList: OrderType[] = [];
          querySnapshot.docs.forEach((d) => {
            const data: OrderType = {
              id: d.id,
              createdBy: d.data().createdBy,
              createdAt: d.data().createdAt,
              drinks: d.data().drinks,
              status: d.data().status,
              completedBy: d.data().completedBy,
              updatedAt: d.data().updatedAt,
            };

            newOrdersList.push(data as OrderType);
          });

          if (status === "completed") setCompletedOrders(newOrdersList);
          else setNewOrders(newOrdersList);
        },
        (error) => console.error(error),
        () => setIsOrderLoading(false)
      );
    },
    [db]
  );

  const getNewOrdersCount = useCallback(() => {
    const orderQuery = query(collection(db, "orders"), where("status", "==", "new"));

    onSnapshot(
      orderQuery,
      (snapshot) => {
        setNewOrderCount(snapshot.docs.length);
      },
      (error) => console.error(error)
    );
  }, [db]);

  const getPendingOrder = useCallback(() => {
    const orderQuery = query(
      collection(db, "orders"),
      where("updatedBy.id", "==", user.id),
      where("status", "==", "pending"),
      limit(1)
    );

    setIsOrderLoading(true);
    onSnapshot(
      orderQuery,
      (snapshot) => {
        if (snapshot.docs.length === 0) {
          setOrderLoaded(null);
          return;
        }

        const d = snapshot.docs[0];
        const data: OrderType = {
          id: d.id,
          createdBy: d.data().createdBy,
          createdAt: d.data().createdAt,
          drinks: d.data().drinks,
          status: d.data().status,
          completedBy: d.data().completedBy,
          updatedAt: d.data().updatedAt,
        };

        setOrderLoaded(data);
      },
      (error) => console.error(error),
      () => setIsOrderLoading(false)
    );
  }, [user, db]);

  const getExistingOrder = useCallback(() => {
    const orderQuery = query(
      collection(db, "orders"),
      where("createdBy.id", "==", user.id),
      where("status", "in", ["new", "pending"]),
      limit(1)
    );

    setIsOrderLoading(true);

    onSnapshot(
      orderQuery,
      (snapshot) => {
        dispatchOrder({ type: "RESET_ORDER", payload: null });

        if (snapshot.docs.length === 0) {
          setOrderLoaded(null);
          setIsOrderLoading(false);
          return;
        }

        const docsId = snapshot.docs[0].id;
        const docsData = snapshot.docs[0].data();
        docsData.drinks.forEach((d: DrinkType) => {
          dispatchOrder({ type: "ADD_DRINK", payload: d });
        });

        const data: OrderType = {
          id: docsId,
          createdBy: docsData.createdBy,
          createdAt: docsData.createdAt,
          drinks: docsData.drinks,
          status: docsData.status,
          completedBy: docsData.completedBy,
          updatedAt: docsData.updatedAt,
        };

        if (data.status === "completed") {
          setOrderLoaded(null);
          dispatchOrder({ type: "RESET_ORDER", payload: null });
          message.success("Order completed", 3);
          setOrderLoaded(data);
        } else {
          setOrderLoaded(data);
          getNewOrdersCount();
        }

        setIsOrderLoading(false);
      },
      (error) => console.error(error),
      () => setIsOrderLoading(false)
    );
  }, [user, db, getNewOrdersCount]);

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
    if (!orderLoaded) return;
    const docRef = doc(db, "orders", orderLoaded.id);
    const updatedStatus = {
      status: "completed",
      completedBy: {
        id: user.id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
      },
      updatedAt: serverTimestamp(),
    };

    setIsSaving(true);
    updateDoc(docRef, updatedStatus)
      .then(() => {
        message.success("Order completed", 2);
        setIsSaving(false);
        setOrderLoaded(null);

        // TODO:  This ticket update is not happening
        const userRef = doc(db, "users", orderLoaded.createdBy.id);
        getDoc(userRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              const userDoc = docSnap.data();
              if (userDoc) {
                const tickets = userDoc.tickets - ticketsPending;
                const updatedUser = {
                  tickets,
                };

                updateDoc(userRef, updatedUser).catch((e) => console.error(e));
              }
            } else {
              console.error("User does not exist");
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => {
        console.error(e);
      });
  }, [db, user, orderLoaded, ticketsPending]);

  const cancelOrderLoaded = useCallback(() => {
    if (!orderLoaded) return;
    const docRef = doc(db, "orders", orderLoaded.id);
    const updatedStatus = {
      status: "cancelled",
      updatedAt: serverTimestamp(),
    };

    updateDoc(docRef, updatedStatus)
      .then(() => {
        setOrderLoaded(null);
      })
      .catch((e) => {
        message.error("There was an issue cancelling the order. Please contact the host.", 5);
        console.error(e);
      });
  }, [db, orderLoaded]);

  const cancelOrder = useCallback(() => {
    if (!orderLoaded) return;
    const docRef = doc(db, "orders", orderLoaded.id);
    const updatedStatus = {
      status: "cancelled",
      updatedAt: serverTimestamp(),
    };

    setIsSaving(true);
    updateDoc(docRef, updatedStatus)
      .then(() => {
        message.success("Order cancelled!", 5);
        setIsSaving(false);
        dispatchOrder({ type: "RESET_ORDER", payload: null });
      })
      .catch((e) => {
        message.error("There was an issue cancelling the order. Please contact the host.", 5);
        console.error(e);
      });
  }, [db, orderLoaded]);

  const getCocktail = useCallback(() => {
    const cocktailQuery = query(collection(db, "cocktail_type"));
    const cocktailList: CocktailType[] = [];

    getDocs(cocktailQuery)
      .then((snapshot) => {
        snapshot.docs.forEach((d) => {
          const newCocktail: CocktailType = {
            id: d.id,
            name: d.data().name,
            available: d.data().available,
            description: d.data().description,
          };

          cocktailList.push(newCocktail);
        });

        setCocktail(cocktailList);
      })
      .catch((e) => console.error(e));
  }, [db]);

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
    const newOrder = {
      createdBy: {
        id: user.id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
      },
      createdAt: serverTimestamp(),
      drinks: order,
      status: "new",
      updatedAt: serverTimestamp(),
    };

    setIsSaving(true);

    addDoc(collectionRef, newOrder)
      .then(() => {
        getExistingOrder();
      })
      .catch((e) => {
        message.error("There was an issue completing the order. Please contact the host.", 5);
        console.error(e);
      })
      .finally(() => {
        setIsSaving(false);
      });
  }, [order, user, db, getExistingOrder]);

  const updateOrderStatus = useCallback(
    (o: OrderType | null, status: OrderTypeStatus) => {
      if (!o) return;
      const docRef = doc(db, "orders", o.id);
      const updatedStatus = {
        completedBy:
          status === "new"
            ? null
            : {
                id: user.id,
                name: user.name,
                email: user.email,
                photoURL: user.photoURL,
              },
        status,
        updatedAt: serverTimestamp(),
      };

      updateDoc(docRef, updatedStatus).catch((e) => {
        console.error(e);
      });
    },
    [db, user]
  );

  const checkOrderPristine = useCallback(
    (checkOrder: OrderType) => {
      const orderQuery = query(
        collection(db, "orders"),
        where("id", "==", checkOrder.id),
        where("status", "==", "pending"),
        where("completedBy.id", "==", user.id)
      );
      getDocs(orderQuery)
        .then((snapshot) => {
          if (snapshot.docs.length === 0) {
            setIsOrderModalVisible(false);
          }
        })
        .catch((e) => console.error(e));
    },
    [db, user, setIsOrderModalVisible]
  );

  const updateOrderPending = useCallback(
    (o: OrderType) => {
      const docRef = doc(db, "orders", o.id);
      const updatedStatus = {
        updatedBy: {
          id: user.id,
          name: user.name,
          email: user.email,
          photoURL: user.photoURL,
        },
        status: "pending",
        updatedAt: serverTimestamp(),
      };

      setIsSaving(true);
      updateDoc(docRef, updatedStatus)
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          setIsSaving(false);
        });
    },
    [db, user]
  );

  const calculateTicketsFromOrder = useCallback((o: DrinkType[]) => {
    let ticketsTotal = 0;
    o.forEach((drink: DrinkType) => {
      if (drink.double === true) ticketsTotal += 2;
      else ticketsTotal += 1;
    });
    return ticketsTotal;
  }, []);

  useEffect(() => {
    let ticketsTotal = 0;
    ticketsTotal = calculateTicketsFromOrder(orderLoaded ? orderLoaded.drinks : order);
    setTicketsPending(ticketsTotal);
  }, [order, orderLoaded, calculateTicketsFromOrder]);

  return {
    getCocktail,
    getAlcohol,
    getMixer,
    getGarnish,
    dispatchOrder,
    saveOrder,
    getExistingOrder,
    getOrderHistory,
    cancelOrder,
    getOrders,
    setOrderLoaded,
    completeOrderLoaded,
    cancelOrderLoaded,
    newOrders,
    completedOrders,
    updateOrderStatus,
    updateOrderPending,
    getPendingOrder,
    cocktail,
    alcohol,
    mixer,
    garnish,
    order,
    orderLoaded,
    ticketsPending,
    orderHistory,
    isSaving,
    isOrderLoading,
    isHistoryLoading,
    newOrderCount,
    checkOrderPristine,
    isOrderModalVisible,
    setIsOrderModalVisible,
  };
};

export default useOrder;
export type { DrinkType, AlcoholType, MixerType, GarnishType, OrderType, CocktailType };
