import React, { useContext, useEffect, useState } from "react";
import type { FC } from "react";
import { Modal, Divider, Avatar, Switch } from "antd";
import { CheckOutlined, UserOutlined, CheckCircleFilled } from "@ant-design/icons";
import { v4 as uuid } from "uuid";
import AuthContext from "src/store/auth-context";
import useAuthProtect from "src/hooks/AuthProtect";
import useOrder from "src/hooks/Order";
import DrinkList from "src/pages/OrderPage/DrinkList";
import type { OrderType } from "src/hooks/Order";

import "./index.scss";

const BartenderPage: FC = () => {
  useAuthProtect().validateAuth();
  const { user } = useContext(AuthContext);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState<boolean>(false);
  const [isAutoDelegate, setIsAutoDelegate] = useState<boolean>(false);

  const {
    updateOrderPending,
    updateOrderStatus,
    cancelOrderLoaded,
    orderLoaded,
    newOrders,
    completedOrders,
    getOrders,
    getPendingOrder,
  } = useOrder();

  useEffect(() => {
    getOrders("new");
    getOrders("completed");
    getPendingOrder();
  }, [getOrders, getPendingOrder, user]);

  const handleCompleteOrder = () => {
    Modal.confirm({
      title: "Complete This Order?",
      okText: "Complete Order",
      okButtonProps: { icon: <CheckOutlined /> },
      onOk: () => updateOrderStatus(orderLoaded, "completed"),
    });
  };

  const avatar = (photoUrl: string): JSX.Element => (
    <div className="avatar">
      {photoUrl ? <Avatar src={photoUrl} /> : <Avatar size="large" icon={<UserOutlined />} />}
    </div>
  );

  const orderSummary = (o: OrderType): JSX.Element => (
    <div className="order-summary-item" key={uuid()}>
      <div className="avatar-container">{avatar(o.createdBy.photoURL)}</div>
      <div className="order-info">
        <div className="guest">{o.createdBy.name}</div>
        <div className="drinks">{o.drinks.length} drinks</div>
      </div>
    </div>
  );

  useEffect(() => {
    if (orderLoaded) setIsOrderModalVisible(true);
    else setIsOrderModalVisible(false);
  }, [orderLoaded]);

  useEffect(() => {
    if (isAutoDelegate && newOrders.length > 0 && !orderLoaded) {
      updateOrderPending(newOrders[0]);
    }
  }, [isAutoDelegate, newOrders, orderLoaded, updateOrderPending]);

  return (
    <div className="bar-page">
      <div className="header">
        <h1 className="small">
          Hello, {user.name}.<br />
          Let&apos;s Rock n Roll.
        </h1>
      </div>
      <div className="auto-delegate">
        <span>Auto-delegate Orders</span>
        <Switch checked={isAutoDelegate} onChange={() => setIsAutoDelegate(!isAutoDelegate)} />
      </div>
      <Divider>{newOrders.length ?? 0} New Orders</Divider>
      {!!newOrders.length && (
        <div className="order-list">
          {newOrders.map((o, index) => (
            <div
              key={uuid()}
              className="order-card new"
              onClick={() => updateOrderPending(o)}
              onKeyDown={() => {}}
              role="button"
              tabIndex={index}
            >
              {orderSummary(o)}
            </div>
          ))}
        </div>
      )}
      {!!completedOrders.length && (
        <>
          <Divider>{completedOrders.length} Completed Orders</Divider>
          <div className="order-list">
            {completedOrders.map((o, index) => (
              <div key={uuid()} className="order-card completed" role="button" tabIndex={index}>
                {orderSummary(o)}
                <div className="status-icon">
                  <CheckCircleFilled />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <Modal
        title="Order Details"
        destroyOnClose
        maskClosable={false}
        open={isOrderModalVisible}
        okText="Complete Order"
        okButtonProps={{ icon: <CheckOutlined /> }}
        onOk={handleCompleteOrder}
        onCancel={() => {
          updateOrderStatus(orderLoaded, "new");
          setIsAutoDelegate(false);
        }}
      >
        {orderLoaded && (
          <div className="order-details">
            <Divider />
            <h3>Guest: {orderLoaded.createdBy.name}</h3>
            <h3 className="order">Order:</h3>
            <DrinkList order={orderLoaded.drinks} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BartenderPage;
