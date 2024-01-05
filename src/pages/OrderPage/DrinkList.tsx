import React from "react";
import type { FC } from "react";
import { v4 as uuid } from "uuid";
import { Button, Divider } from "antd";
import type { DrinkType } from "src/hooks/Order";
import Drink from "src/pages/OrderPage/Drink";

import "./DrinkList.scss";

interface DrinkListProps {
  order: DrinkType[];
  removeAction?: (index: number) => void;
  showAction?: boolean;
}

const DrinkList: FC<DrinkListProps> = ({ order, removeAction, showAction }) => (
  <div className="drink-list">
    {order.length > 0 && (
      <Divider>
        <h2>Your Order</h2>
      </Divider>
    )}
    {order.map((drink, i) => (
      <div key={uuid()} className="order-item">
        <div className="drink">
          <Drink drink={drink} />
        </div>
        {showAction && removeAction && (
          <Button onClick={() => removeAction(i)} className="remove-button">
            Remove
          </Button>
        )}
      </div>
    ))}
  </div>
);

export default DrinkList;
