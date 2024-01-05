import React, { useState, useContext, useEffect, useMemo } from "react";
import type { FC } from "react";
import { Divider, Button, Drawer, Modal, Spin, message } from "antd";
import { CheckCircleFilled, HistoryOutlined, RocketOutlined, CameraOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AuthContext from "src/store/auth-context";
import useOrder from "src/hooks/Order";
import MainNav from "src/components/MainNav";
import type { DrinkType } from "src/hooks/Order";
import DrinkForm from "src/components/DrinkForm";
import DrinkList from "src/pages/OrderPage/DrinkList";
import OrderHistory from "src/pages/OrderPage/OrderHistory";
import ButtonCta from "src/components/ButtonCta";
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
  const [isCancelOrderVisible, setIsCancelOrderVisible] = useState(false);
  const [isCancelOrderLoadedVisible, setIsCancelOrderLoadedVisible] = useState(false);
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
    dispatchOrder({ type: "RESET_ORDER", payload: null });
    setIsCancelOrderVisible(false);
  };

  const handleCancelOrderLoaded = () => {
    cancelOrder();
    setIsCancelOrderLoadedVisible(false);
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
    if (user.tickets - ticketsPending === 0) setShowHistoryDrawer(false);
  }, [user, getExistingOrder, getOrderHistory, ticketsPending]);

  const postDrinkButton = (
    <Button type="default" size="large" onClick={() => routerNav("/photo-upload")} icon={<CameraOutlined />}>
      Post a photo
    </Button>
  );

  return (
    <div className="order-page">
      <div className="header">
        <h1>
          Join Us For a Drink!
          <br />
          Post a Photo
        </h1>
        <p>Complete your order, then scan your QR code at the bar.</p>
        <p>Be sure to post more photos to get more drink passes.</p>
        <br />
        {postDrinkButton}
      </div>
      <div className="virtual-hostess">
        <Divider>
          <h2>
            <strong>{user.tickets - ticketsPending ?? "No"}</strong> Drink Passes
          </h2>
        </Divider>
        <div className="order-actions">
          {isOrderLoading && <Spin />}
          {!isOrderLoading && !orderId && (
            <>
              <ButtonCta title="Create a Drink" action={() => setShowOrderDrawer(true)} icon={<RocketOutlined />} />
              <ButtonCta title="Order History" action={() => setShowHistoryDrawer(true)} icon={<HistoryOutlined />} />
            </>
          )}
        </div>
        {!isOrderLoading && orderId && (
          <div className="qr-code">
            {orderLoaded?.completedBy && <CheckCircleFilled />}
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${orderId}`} alt="qr code" />
            <h4>Scan this QR code at the bar</h4>
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
          <div className="completion-actions order-actions">
            <Button size="large" onClick={() => setIsCancelOrderVisible(true)} loading={isSaving}>
              Cancel Order
            </Button>
            <Button type="primary" size="large" onClick={handleCompleteOrder} loading={isSaving}>
              Complete Order
            </Button>
          </div>
        )}
        {order.length > 0 && orderId && (
          <div className="completion-actions order-actions">
            <Button size="large" onClick={() => setIsCancelOrderLoadedVisible(true)} loading={isSaving}>
              Cancel Order
            </Button>
          </div>
        )}
      </div>
      <Drawer title="Create a Drink" open={showOrderDrawer} onClose={() => setShowOrderDrawer(false)} destroyOnClose>
        {user.tickets - ticketsPending > 0 && (
          <DrinkForm
            submitDrink={handleSubmitDrink}
            alcohol={alcoholMemo}
            mixer={mixerMemo}
            garnish={garnishMemo}
            ticketsPending={ticketsPending}
          />
        )}
        {user.tickets - ticketsPending < 1 && (
          <div className="no-tickets">
            <p>Post more photos to receive more drink passes.</p>
            {postDrinkButton}
          </div>
        )}
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
      <Modal
        title="Cancel Order"
        open={isCancelOrderVisible}
        onOk={handleCancelOrder}
        okText="Yes, Cancel Order"
        cancelText="No"
        onCancel={() => setIsCancelOrderVisible(false)}
      >
        <p>Are you sure you want to cancel this order?</p>
      </Modal>
      <Modal
        title="Cancel Order"
        open={isCancelOrderLoadedVisible}
        onOk={handleCancelOrderLoaded}
        okText="Yes, Cancel Order"
        cancelText="No"
        onCancel={() => setIsCancelOrderLoadedVisible(false)}
      >
        <p>Are you sure you want to cancel this order?</p>
      </Modal>
    </div>
  );
};

export default OrderPage;
