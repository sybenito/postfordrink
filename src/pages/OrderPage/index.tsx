import React, { useState, useContext, useEffect } from "react";
import type { FC } from "react";
import { Divider, Button, Drawer, Select, Input } from "antd";
import AuthContext from "src/store/auth-context";
import useOrder from "src/hooks/Order";

const OrderPage: FC = () => {
  const { getAlcohol, getMixer, getGarnish, alcohol, mixer, garnish } = useOrder();
  const { user } = useContext(AuthContext);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    getAlcohol();
    getMixer();
    getGarnish();
  }, []);

  return (
    <div className="order-page">
      <h1>{user.tickets ?? 0} Drinks</h1>
      <Divider>
        <h2>Virtual Hostess</h2>
      </Divider>
      <Button
        type="primary"
        onClick={() => {
          setShowOrderModal(true);
        }}
      >
        + Create a Drink
      </Button>
      <Drawer title="Create a Drink" open={showOrderModal} onClose={() => setShowOrderModal(false)} destroyOnClose>
        <p>Start With</p>
        <Select>
          {alcohol.map((a) => (
            <Select.Option key={a.id} value={a.name}>
              {a.name}
            </Select.Option>
          ))}
        </Select>
        <p>Mix With</p>
        <Select>
          {mixer.map((a) => (
            <Select.Option key={a.id} value={a.name}>
              {a.name}
            </Select.Option>
          ))}
        </Select>
        <p>Finish With</p>
        <Select>
          {garnish.map((a) => (
            <Select.Option key={a.id} value={a.name}>
              {a.name}
            </Select.Option>
          ))}
        </Select>
        <Input.TextArea placeholder="Additional Requests" autoSize={{ minRows: 2, maxRows: 2 }} />
        <Button type="primary">Add Drink to Order</Button>
      </Drawer>
    </div>
  );
};

export default OrderPage;
