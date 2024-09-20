import React, { useState, useContext, useEffect, useMemo } from "react";
import type { FC } from "react";
import { Divider, Button, Drawer, Modal, Spin, message } from "antd";
import { CheckCircleFilled, HistoryOutlined, CameraOutlined } from "@ant-design/icons";
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
    getCocktail,
    getAlcohol,
    getMixer,
    getGarnish,
    saveOrder,
    getExistingOrder,
    getOrderHistory,
    cancelOrder,
    cocktail,
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

  const cocktailMemo = useMemo(() => cocktail, [cocktail]);
  const alcoholMemo = useMemo(() => alcohol, [alcohol]);
  const mixerMemo = useMemo(() => mixer, [mixer]);
  const garnishMemo = useMemo(() => garnish, [garnish]);

  useAuthProtect().validateAuth();

  const handleSubmitDrink = (drink: DrinkType) => {
    dispatchOrder({ type: "ADD_DRINK", payload: drink });
    setShowOrderDrawer(false);
    message.success("Drink added to order");
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
    setShowHistoryDrawer(false);
    message.success("Drink added to order");
  };

  useEffect(() => {
    if (cocktailMemo.length === 0) getCocktail();
    if (alcoholMemo.length === 0) getAlcohol();
    if (mixerMemo.length === 0) getMixer();
    if (garnishMemo.length === 0) getGarnish();
  }, [
    cocktailMemo.length,
    alcoholMemo.length,
    garnishMemo.length,
    getCocktail,
    getAlcohol,
    getGarnish,
    getMixer,
    mixerMemo.length,
  ]);

  useEffect(() => {
    getExistingOrder();
    getOrderHistory();
  }, [user, getExistingOrder, getOrderHistory]);

  return (
    <div className="order-page">
      <div className="header">
        <h1>Join Us For a Drink!</h1>
        <p>
          <strong>First</strong> complete your drink order
        </p>
        <p>
          <strong>Then</strong> scan your QR code at the bar.
        </p>
        <p>Be sure to post more photos to get more drink passes.</p>
        <br />
        <div className="action-container">
          <Button type="default" onClick={() => routerNav("/photo-upload")} icon={<CameraOutlined />}>
            Post a Photo
          </Button>
        </div>
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
              icon={<span className="drink-icon" />}
              onClick={() => {
                setShowOrderDrawer(true);
              }}
              disabled={user.tickets === 0 || (user.tickets > 0 && ticketsPending >= user.tickets)}
            >
              {order.length > 0 && <span>Add a Drink</span>}
              {order.length === 0 && <span>Order a Drink</span>}
            </Button>
            <Button
              type="primary"
              icon={<HistoryOutlined />}
              onClick={() => {
                setShowHistoryDrawer(true);
              }}
            >
              Order History
            </Button>
          </div>
        )}
        {!isOrderLoading && orderId && (
          <div className="qr-code">
            {orderLoaded?.completedBy && <CheckCircleFilled />}
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${orderId}`} alt="qr code" />
            <h3>Scan QR code at the bar</h3>
          </div>
        )}
        {user.tickets === 0 && (
          <div className="no-tickets">
            <p>Upload more photos to get more drink passes.</p>
            <Button onClick={() => routerNav("/photo-upload")} icon={<CameraOutlined />}>
              Post a Photo
            </Button>
          </div>
        )}
        <DrinkList order={order} removeAction={handleRemoveDrink} showAction={!orderId} />
        {order.length > 0 && !orderId && (
          <div className="order-actions wide">
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
      <Drawer title="Order a Cocktail" open={showOrderDrawer} onClose={() => setShowOrderDrawer(false)} destroyOnClose>
        <DrinkForm
          submitDrink={handleSubmitDrink}
          cocktail={cocktailMemo}
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
