import React from "react";
import type { FC } from "react";
import type { DrinkType } from "src/hooks/Order";

interface OrderPageProps {
  drink: DrinkType;
}

const OrderPage: FC<OrderPageProps> = ({ drink }) => (
  <div className="drink-item">
    {drink.cocktail && <div className="cocktail item">{drink.cocktail?.name}</div>}
    {drink.alcohol && (
      <>
        <div className="alcohol item">
          {drink.double ? "Double " : ""}
          {drink.alcohol?.name}
        </div>
        <div className="mixer item">{drink.mixer.map((m) => m.name).join(" + ")}</div>
        <div className="garnish item">{drink.garnish.map((g) => g.name).join(" + ")}</div>
        <div className="request item">{drink.request}</div>
      </>
    )}
  </div>
);

export default OrderPage;
