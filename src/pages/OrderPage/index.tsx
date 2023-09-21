import React, { useState, useContext, useEffect, useMemo } from "react";
import type { FC } from "react";
import { Divider, Button, Drawer, Modal, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import AuthContext from "src/store/auth-context";
import useOrder from "src/hooks/Order";
import MainNav from "src/components/MainNav";
import type { DrinkType } from "src/hooks/Order";
import DrinkForm from "src/components/DrinkForm";
import DrinkList from "src/pages/OrderPage/DrinkList";

const OrderPage: FC = () => {
  const { user } = useContext(AuthContext);
  const {
    dispatchOrder,
    getAlcohol,
    getMixer,
    getGarnish,
    saveOrder,
    getExistingOrder,
    alcohol,
    mixer,
    garnish,
    order,
    ticketsPending,
    qrCode,
    isSaving,
    isOrderLoading,
  } = useOrder();
  const [showOrderDrawer, setShowOrderDrawer] = useState(false);
  const routerNav = useNavigate();

  const alcoholMemo = useMemo(() => alcohol, [alcohol]);
  const mixerMemo = useMemo(() => mixer, [mixer]);
  const garnishMemo = useMemo(() => garnish, [garnish]);

  const handleSubmitDrink = (drink: DrinkType) => {
    dispatchOrder({ type: "ADD_DRINK", payload: drink });
    setShowOrderDrawer(false);
  };

  const handleCloseOrderDrawer = () => {
    setShowOrderDrawer(false);
  };

  const handleRemoveDrink = (index: number) => {
    dispatchOrder({ type: "REMOVE_DRINK", payload: index });
  };

  const handleCompleteOrder = () => saveOrder().catch((e) => console.log(e));

  const handleCancelOrder = () => {
    Modal.confirm({
      title: "Cancel Order",
      content: "Are you sure you want to cancel this order?",
      okText: "Yes, Cancel",
      cancelText: "No",
      onOk: () => {
        dispatchOrder({ type: "RESET_ORDER", payload: null });
      },
    });
  };

  useEffect(() => {
    if (alcoholMemo.length === 0) getAlcohol();
    if (mixerMemo.length === 0) getMixer();
    if (garnishMemo.length === 0) getGarnish();
  }, []);

  useEffect(() => {
    getExistingOrder();
  }, [user]);

  return (
    <div className="order-page">
      <h1>{user.tickets - ticketsPending ?? 0} Drink Creds</h1>
      <Divider>
        <h2>Virtual Hostess</h2>
      </Divider>
      {isOrderLoading && <Spin />}
      {!isOrderLoading && !qrCode && (
        <Button
          type="primary"
          onClick={() => {
            setShowOrderDrawer(true);
          }}
          disabled={user.tickets === 0 || (user.tickets > 0 && ticketsPending >= user.tickets)}
        >
          + Create a Drink
        </Button>
      )}
      {!isOrderLoading && qrCode && (
        <div className="qr-code">
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrCode}`} alt="qr code" />
          <p>Scan this QR code at the bar</p>
        </div>
      )}
      {user.tickets === 0 && (
        <div className="no-tickets">
          <p>Upload more photos to get more drink creds.</p>
          <Button onClick={() => routerNav("/photo-upload")}>Upload Photos</Button>
        </div>
      )}
      <DrinkList order={order} removeAction={handleRemoveDrink} showAction={!qrCode} />
      {order.length > 0 && (
        <div className="order-actions">
          <Button type="primary" size="large" onClick={handleCompleteOrder} loading={isSaving}>
            Complete Order
          </Button>
          <Button size="large" onClick={handleCancelOrder} loading={isSaving}>
            Cancel Order
          </Button>
        </div>
      )}
      <Drawer title="Create a Drink" open={showOrderDrawer} onClose={handleCloseOrderDrawer} destroyOnClose>
        <DrinkForm
          submitDrink={handleSubmitDrink}
          alcohol={alcoholMemo}
          mixer={mixerMemo}
          garnish={garnishMemo}
          ticketsPending={ticketsPending}
        />
        <div className="random-meme">TODO: PULL RANDOM DRINKING MEME</div>
      </Drawer>
      <MainNav />
    </div>
  );
};

export default OrderPage;
