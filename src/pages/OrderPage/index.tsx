import React, { useState, useContext, useEffect } from "react";
import type { FC } from "react";
import { Divider, Button, Drawer } from "antd";
import { v4 as uuid } from "uuid";
import AuthContext from "src/store/auth-context";
import useOrder from "src/hooks/Order";
import MainNav from "src/components/MainNav";
import type { DrinkType } from "src/hooks/Order";
import DrinkForm from "src/components/DrinkForm";

const OrderPage: FC = () => {
  const { user } = useContext(AuthContext);
  const { dispatchOrder, order } = useOrder();
  const [showOrderDrawer, setShowOrderDrawer] = useState(false);

  const handleSubmitDrink = (drink: DrinkType) => {
    dispatchOrder({ type: "ADD", payload: drink });
    setShowOrderDrawer(false);
  };

  const handleCloseOrderDrawer = () => {
    setShowOrderDrawer(false);
  };

  return (
    <div className="order-page">
      <h1>{user.tickets ?? 0} Drinks</h1>
      <Divider>
        <h2>Virtual Hostess</h2>
      </Divider>
      <Button
        type="primary"
        onClick={() => {
          setShowOrderDrawer(true);
        }}
      >
        + Create a Drink
      </Button>
      <div className="order-list">
        {order.drinks.map((drink, i) => (
          <div key={uuid()} className="order-item">
            <div className="order-item-alcohol">
              {drink.double ? "double " : ""}
              {drink.alcohol?.name}
            </div>
            <div className="order-item-mixer">{drink.mixer.map((m) => m.name).join(" + ")}</div>
            <div className="order-item-garnish">{drink.garnish.map((g) => g.name).join(" + ")}</div>
            <div className="order-item-request">{drink.request}</div>
            <Button
              onClick={() => {
                dispatchOrder({ type: "REMOVE", payload: i });
              }}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      <Drawer title="Create a Drink" open={showOrderDrawer} onClose={handleCloseOrderDrawer} destroyOnClose>
        <DrinkForm submitDrink={handleSubmitDrink} />
        <div className="random-meme">TODO: PULL RANDOM DRINKING MEME</div>
      </Drawer>
      <MainNav />
    </div>
  );
};

export default OrderPage;
