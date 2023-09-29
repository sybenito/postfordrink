import React, { useContext, useEffect } from "react";
import type { FC } from "react";
import { Modal, Button } from "antd";
import AuthContext from "src/store/auth-context";
import QRCodeScanner from "src/components/QrCodeScanner";
import useAuthProtect from "src/hooks/AuthProtect";
import useOrder from "src/hooks/Order";
import DrinkList from "src/pages/OrderPage/DrinkList";

const BartenderPage: FC = () => {
  useAuthProtect().validateAuth();
  const { user } = useContext(AuthContext);
  const { getOrderById, setOrderId, setOrderLoaded, completeOrderLoaded, orderId, orderLoaded } = useOrder();

  const handleScanResult = (result: string) => {
    setOrderId(result);
  };

  const handleCompleteOrder = () => {
    Modal.confirm({
      title: "Complete This Order?",
      onOk: completeOrderLoaded,
    });
  };

  const handleCancelOrder = () => {
    Modal.confirm({
      title: "Cancel This Order?",
      content: "This guest will be able to re-scan the order QR code.",
      onOk: () => {
        setOrderId(null);
        setOrderLoaded(null);
      },
    });
  };

  useEffect(() => {
    if (orderId) getOrderById();
  }, [orderId, getOrderById]);

  return (
    <div className="bar-page">
      <div className="header">
        <h1>
          Hello, {user.name}.<br />
          Let&apos;s Rock n Roll.
        </h1>
      </div>
      <div className="order">
        {!orderLoaded && <QRCodeScanner scanResultAction={handleScanResult} />}
        {orderLoaded && (
          <div className="order-details">
            <h2>Order Details</h2>
            <p>Guest: {orderLoaded.createdBy.name}</p>
            <p>Drinks:</p>
            <DrinkList order={orderLoaded.drinks} />
            <div className="order-actions">
              <Button onClick={handleCancelOrder}>Cancel</Button>
              <Button onClick={handleCompleteOrder} type="primary">
                Complete Order
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BartenderPage;
