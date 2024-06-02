import React, { useState, useEffect } from "react";
import type { FC } from "react";
import { Drawer, Button, Form, Input, Checkbox, Space } from "antd";
import useOrder, { AlcoholType, MixerType, GarnishType } from "src/hooks/Order";
import useAdmin from "src/hooks/Admin";

type StockType = "ALCOHOL" | "MIXER" | "GARNISH";

const BarTab: FC = () => {
  const [form] = Form.useForm();
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [stockType, setStockType] = useState<StockType>();
  const { getAlcohol, getMixer, getGarnish } = useOrder();
  const {
    isSaving,
    selectedId,
    addAlcohol,
    addMixer,
    addGarnish,
    updateAlcohol,
    updateGarnish,
    updateMixer,
    setSelectedId,
  } = useAdmin();

  useEffect(() => {
    getAlcohol();
    getMixer();
    getGarnish();
  }, [getAlcohol, getMixer, getGarnish]);

  const openDrawer = (type: StockType, id?: string) => {
    if (id) setSelectedId(id);
    setStockType(type);
    setIsDrawerVisible(true);
  };
  const closeDrawer = () => setIsDrawerVisible(false);

  const handleCancel = () => {
    setSelectedId(undefined);
    closeDrawer();
  };

  const handleSubmit = (e: object) => {
    const { name, canDouble, available } = e as AlcoholType & MixerType & GarnishType;
    let formData;
    switch (stockType) {
      case "ALCOHOL":
        formData = {
          name,
          canDouble,
          available,
        };
        if (selectedId) updateAlcohol(formData);
        else addAlcohol(formData);
        break;
      case "MIXER":
        formData = {
          name,
          available,
        };
        if (selectedId) updateMixer(formData);
        else addMixer(formData);
        break;
      case "GARNISH":
        formData = {
          name,
          available,
        };
        if (selectedId) updateGarnish(formData);
        else addGarnish(formData);
        break;
      default:
        break;
    }
    handleCancel();
  };

  const barForm = (
    <Form form={form} name="bar-stock" onFinish={handleSubmit}>
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input maxLength={50} disabled={isSaving} />
      </Form.Item>
      {stockType === "ALCOHOL" && (
        <Form.Item name="canDouble" label="Can Double" valuePropName="checked">
          <Checkbox disabled={isSaving} />
        </Form.Item>
      )}
      <Form.Item name="available" label="Is Available" valuePropName="checked">
        <Checkbox disabled={isSaving} />
      </Form.Item>
    </Form>
  );

  return (
    <div className="bar-stock-editor">
      <Button onClick={() => openDrawer("ALCOHOL")}>Add Alcohol</Button>
      <Button onClick={() => openDrawer("MIXER")}>Add Mixer</Button>
      <Button onClick={() => openDrawer("GARNISH")}>Add Garnish</Button>
      <Drawer
        title={`${stockType} STOCK`}
        placement="right"
        closable={false}
        open={isDrawerVisible}
        extra={
          <Form form={form}>
            <Space>
              {selectedId && (
                <Button htmlType="submit" type="primary" disabled={isSaving}>
                  Update
                </Button>
              )}
              {!selectedId && (
                <Button htmlType="submit" type="primary" disabled={isSaving}>
                  Add Stock
                </Button>
              )}
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form>
        }
      >
        {barForm}
      </Drawer>
    </div>
  );
};

export default BarTab;
