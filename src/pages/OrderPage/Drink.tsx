import React from "react";
import type { FC } from "react";
import type { DrinkType } from "src/hooks/Order";

interface OrderPageProps {
  drink: DrinkType;
}

const OrderPage: FC<OrderPageProps> = ({ drink }) => (
  <>
    <div className="alcohol">
      {drink.double ? "double " : ""}
      {drink.alcohol?.name}
    </div>
    <div className="mixer">{drink.mixer.map((m) => m.name).join(" + ")}</div>
    <div className="garnish">{drink.garnish.map((g) => g.name).join(" + ")}</div>
    <div className="request">{drink.request}</div>
  </>
);

export default OrderPage;
