import React from "react";
import type { FC } from "react";
import { v4 as uuid } from "uuid";
import { Button, Divider } from "antd";
import type { OrderType, DrinkType } from "src/hooks/Order";
import Drink from "src/pages/OrderPage/Drink";

import "./OrderHistory.scss";

interface OrderHistoryProps {
  orderHistory: OrderType[];
  reorderAction: (drink: DrinkType) => void;
  ticketsRemaining: number;
}

const hasTicketsForDrink = (drink: DrinkType, ticketsRemaining: number) => {
  const drinkMultiple = drink.double ? 2 : 1;
  return ticketsRemaining >= drinkMultiple;
};

const OrderHistory: FC<OrderHistoryProps> = ({ orderHistory, reorderAction, ticketsRemaining }) => (
  <div className="drinks">
    {orderHistory.map((order, i) => (
      <div className="order-container" key={uuid()}>
        <Divider orientation="right">Order {i + 1}</Divider>
        <div className="order">
          {order.drinks.map((drink) => (
            <div className="drink" key={uuid()}>
              <div className="items">
                <Drink drink={drink} />
              </div>
              <Button onClick={() => reorderAction(drink)} disabled={!hasTicketsForDrink(drink, ticketsRemaining)}>
                Add to Order
              </Button>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default OrderHistory;
