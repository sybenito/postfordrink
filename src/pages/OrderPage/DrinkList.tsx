import React from "react";
import type { FC } from "react";
import { v4 as uuid } from "uuid";
import { Button } from "antd";
import type { DrinkType } from "src/hooks/Order";

interface DrinkListProps {
  order: DrinkType[];
  removeAction: (index: number) => void;
  showAction: boolean;
}

const DrinkList: FC<DrinkListProps> = ({ order, removeAction, showAction }) => (
  <div className="drink-list">
    {order.map((drink, i) => (
      <div key={uuid()} className="order-item">
        <div className="order-item-alcohol">
          {drink.double ? "double " : ""}
          {drink.alcohol?.name}
        </div>
        <div className="order-item-mixer">{drink.mixer.map((m) => m.name).join(" + ")}</div>
        <div className="order-item-garnish">{drink.garnish.map((g) => g.name).join(" + ")}</div>
        <div className="order-item-request">{drink.request}</div>
        {showAction && <Button onClick={() => removeAction(i)}>Remove</Button>}
      </div>
    ))}
  </div>
);

export default DrinkList;
