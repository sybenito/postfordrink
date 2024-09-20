import React from "react";
import type { FC } from "react";
import { v4 as uuid } from "uuid";
import { Button, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
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
    {orderHistory.length === 0 && <h3>No orders in your history</h3>}
    {orderHistory.map((order, i) => (
      <div className="order" key={uuid()}>
        <Divider orientation="left">Order {i + 1}</Divider>
        {order.drinks.map((drink) => (
          <div className="drink" key={uuid()}>
            <Drink drink={drink} />
            <Button onClick={() => reorderAction(drink)} disabled={!hasTicketsForDrink(drink, ticketsRemaining)}>
              <PlusOutlined />
              Add to Order
            </Button>
          </div>
        ))}
      </div>
    ))}
  </div>
);

export default OrderHistory;
