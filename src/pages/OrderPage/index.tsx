import React, { useState, useContext, useEffect, useMemo } from "react";
import type { FC } from "react";
import { Divider, Button, Drawer, Modal, Spin, message } from "antd";
import { CheckCircleFilled, HistoryOutlined, RocketOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AuthContext from "src/store/auth-context";
import useOrder from "src/hooks/Order";
import MainNav from "src/components/MainNav";
import type { DrinkType } from "src/hooks/Order";
import DrinkForm from "src/components/DrinkForm";
import DrinkList from "src/pages/OrderPage/DrinkList";
import OrderHistory from "src/pages/OrderPage/OrderHistory";
import useAuthProtect from "src/hooks/AuthProtect";

import "./index.scss";

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
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const routerNav = useNavigate();

  const alcoholMemo = useMemo(() => alcohol, [alcohol]);
  const mixerMemo = useMemo(() => mixer, [mixer]);
  const garnishMemo = useMemo(() => garnish, [garnish]);

  useAuthProtect().validateAuth();

  const handleSubmitDrink = (drink: DrinkType) => {
    dispatchOrder({ type: "ADD_DRINK", payload: drink });
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
        <h1>Join Us For a Drink!</h1>
        <p>
          <strong>First</strong> create your order
        </p>
        <p>
          <strong>Then</strong> scan your QR code at the bar.
        </p>
        <p>Be sure to post more photos to get more drink passes.</p>
      </div>
      <div className="virtual-hostess">
        <Divider>
          <h2>
            <strong>{user.tickets - ticketsPending ?? "No"}</strong> Drink Passes
          </h2>
        </Divider>
        {isOrderLoading && <Spin />}
        {!isOrderLoading && !orderId && (
          <div className="order-actions">
            <Button
              type="primary"
              onClick={() => {
                setShowOrderDrawer(true);
              }}
              disabled={user.tickets === 0 || (user.tickets > 0 && ticketsPending >= user.tickets)}
            >
              Order
              <RocketOutlined />
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setShowHistoryDrawer(true);
              }}
            >
              History
              <HistoryOutlined />
            </Button>
          </div>
        )}
        {!isOrderLoading && orderId && (
          <div className="qr-code">
            {orderLoaded?.completedBy && <CheckCircleFilled />}
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${orderId}`} alt="qr code" />
            <h3>Scan this QR code at the bar</h3>
          </div>
        )}
        {user.tickets === 0 && (
          <div className="no-tickets">
            <p>Upload more photos to get more drink passes.</p>
            <Button onClick={() => routerNav("/photo-upload")}>Upload Photos</Button>
          </div>
        )}
        <DrinkList order={order} removeAction={handleRemoveDrink} showAction={!orderId} />
        {order.length > 0 && !orderId && (
          <div className="order-actions">
            <Button size="large" onClick={handleCancelOrder} loading={isSaving}>
              Cancel Order
            </Button>
            <Button type="primary" size="large" onClick={handleCompleteOrder} loading={isSaving}>
              Complete Order
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
      <Drawer title="Create a Drink" open={showOrderDrawer} onClose={() => setShowOrderDrawer(false)} destroyOnClose>
        <DrinkForm
          submitDrink={handleSubmitDrink}
          alcohol={alcoholMemo}
          mixer={mixerMemo}
          garnish={garnishMemo}
          ticketsPending={ticketsPending}
        />
      </Drawer>
      <Drawer title="Order History" open={showHistoryDrawer} onClose={() => setShowHistoryDrawer(false)} destroyOnClose>
        <div className="order-history">
          {isHistoryLoading && <Spin />}
          {!isHistoryLoading && (
            <OrderHistory
              orderHistory={orderHistory}
              reorderAction={handleReorderDrink}
              ticketsRemaining={user.tickets - ticketsPending ?? 0}
            />
          )}
        </div>
      </Drawer>
      <MainNav />
    </div>
  );
};

export default OrderPage;
