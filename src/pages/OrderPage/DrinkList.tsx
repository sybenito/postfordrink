import React from "react";
import type { FC } from "react";
import { v4 as uuid } from "uuid";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { DrinkType } from "src/hooks/Order";
import Drink from "src/pages/OrderPage/Drink";

interface DrinkListProps {
  order: DrinkType[];
  removeAction?: (index: number) => void;
  showAction?: boolean;
}

const DrinkList: FC<DrinkListProps> = ({ order, removeAction, showAction }) => (
  <div className="drink-list">
    {order.map((drink, i) => (
      <div key={uuid()} className="order-item">
        <Drink drink={drink} />
        {showAction && removeAction && (
          <Button onClick={() => removeAction(i)} className="remove" type="primary">
            <DeleteOutlined />
          </Button>
        )}
      </div>
    ))}
  </div>
);

export default DrinkList;
