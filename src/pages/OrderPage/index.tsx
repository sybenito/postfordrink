import React, { useState, useContext, useEffect, useMemo } from "react";
import type { FC } from "react";
import { Divider, Button, Drawer, Modal, Spin, message } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AuthContext from "src/store/auth-context";
import useOrder from "src/hooks/Order";
import MainNav from "src/components/MainNav";
import type { DrinkType } from "src/hooks/Order";
import DrinkForm from "src/components/DrinkForm";
import DrinkList from "src/pages/OrderPage/DrinkList";
import OrderHistory from "src/pages/OrderPage/OrderHistory";
import useAuthProtect from "src/hooks/AuthProtect";

const OrderPage: FC = () => {
  const { user } = useContext(AuthContext);
  const {
    dispatchOrder,
    getAlcohol,
    getMixer,
    getGarnish,
    saveOrder,
    getExistingOrder,
    getOrderHistory,
    cancelOrder,
    alcohol,
    mixer,
    garnish,
    order,
    ticketsPending,
    orderId,
    orderHistory,
    isSaving,
    isOrderLoading,
    isHistoryLoading,
    orderLoaded,
  } = useOrder();
  const [showOrderDrawer, setShowOrderDrawer] = useState(false);
  const routerNav = useNavigate();

  const alcoholMemo = useMemo(() => alcohol, [alcohol]);
  const mixerMemo = useMemo(() => mixer, [mixer]);
  const garnishMemo = useMemo(() => garnish, [garnish]);

  useAuthProtect().validateAuth();

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

  const handleCompleteOrder = () => saveOrder();

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

  const handleCancelOrderLoaded = () => {
    Modal.confirm({
      title: "Cancel Order",
      content: "Are you sure you want to cancel this order?",
      okText: "Yes, Cancel",
      cancelText: "No",
      onOk: cancelOrder,
    });
  };

  const handleReorderDrink = (drink: DrinkType) => {
    dispatchOrder({ type: "ADD_DRINK", payload: drink });
    message.success("Drink added to order");
  };

  useEffect(() => {
    if (alcoholMemo.length === 0) getAlcohol();
    if (mixerMemo.length === 0) getMixer();
    if (garnishMemo.length === 0) getGarnish();
  }, [alcoholMemo.length, garnishMemo.length, getAlcohol, getGarnish, getMixer, mixerMemo.length]);

  useEffect(() => {
    getExistingOrder();
    getOrderHistory();
  }, [user, getExistingOrder, getOrderHistory]);

  return (
    <div className="order-page">
      <div className="header">
        <h1>{user.tickets - ticketsPending ?? 0} Drink Creds</h1>
      </div>
      <div className="virtual-hostess">
        <Divider>
          <h2>Virtual Hostess</h2>
        </Divider>
        {isOrderLoading && <Spin />}
        {!isOrderLoading && !orderId && (
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
        {!isOrderLoading && orderId && (
          <div className="qr-code">
            {orderLoaded?.completedBy && <CheckCircleFilled />}
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${orderId}`} alt="qr code" />
            <p>Scan this QR code at the bar</p>
          </div>
        )}
        {user.tickets === 0 && (
          <div className="no-tickets">
            <p>Upload more photos to get more drink creds.</p>
            <Button onClick={() => routerNav("/photo-upload")}>Upload Photos</Button>
          </div>
        )}
        <DrinkList order={order} removeAction={handleRemoveDrink} showAction={!orderId} />
        {order.length > 0 && !orderId && (
          <div className="order-actions">
            <Button type="primary" size="large" onClick={handleCompleteOrder} loading={isSaving}>
              Complete Order
            </Button>
            <Button size="large" onClick={handleCancelOrder} loading={isSaving}>
              Cancel Order
            </Button>
          </div>
        )}
        {order.length > 0 && orderId && (
          <div className="order-actions">
            <Button size="large" onClick={handleCancelOrderLoaded} loading={isSaving}>
              Cancel Order
            </Button>
          </div>
        )}
      </div>

      <div className="order-history">
        <Divider>
          <h2>Order History</h2>
        </Divider>
        {isHistoryLoading && <Spin />}
        {!isHistoryLoading && (
          <OrderHistory
            orderHistory={orderHistory}
            reorderAction={handleReorderDrink}
            ticketsRemaining={user.tickets - ticketsPending ?? 0}
          />
        )}
      </div>

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
