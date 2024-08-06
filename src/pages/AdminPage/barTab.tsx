import React, { useState, useEffect } from "react";
import type { FC } from "react";
import { Drawer, Button, Form, Input, Checkbox, Space, Table, TableProps } from "antd";
import useOrder, { AlcoholType, MixerType, GarnishType } from "src/hooks/Order";
import useAdmin from "src/hooks/Admin";

import "src/pages/AdminPage/barTab.scss";

type StockType = "ALCOHOL" | "MIXER" | "GARNISH";

const optionsColumns: TableProps<AlcoholType | MixerType | GarnishType>["columns"] = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Available",
    dataIndex: "available",
    key: "available",
    render: (available: boolean) => (available ? "Yes" : "No"),
  },
];

const alcoholOptionsColumns: TableProps<AlcoholType | MixerType | GarnishType>["columns"] = [
  ...optionsColumns,
  {
    title: "Can Double",
    dataIndex: "canDouble",
    key: "canDouble",
    render: (canDouble: boolean) => (canDouble ? "Yes" : "No"),
  },
];

const BarTab: FC = () => {
  const [form] = Form.useForm();
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [stockType, setStockType] = useState<StockType>();
  const [selectedStock, setSelectedStock] = useState<AlcoholType | MixerType | GarnishType>();
  const { getAlcohol, getMixer, getGarnish, alcohol, mixer, garnish } = useOrder();
  const { isSaving, addAlcohol, addMixer, addGarnish, updateAlcohol, updateGarnish, updateMixer } = useAdmin();

  useEffect(() => {
    getAlcohol();
    getMixer();
    getGarnish();
  }, [getAlcohol, getMixer, getGarnish]);

  const openDrawer = (type: StockType, stock?: AlcoholType | MixerType | GarnishType) => {
    if (stock) setSelectedStock(stock);
    setStockType(type);
    setIsDrawerVisible(true);
  };
  const closeDrawer = () => setIsDrawerVisible(false);

  const handleCancel = () => {
    setTimeout(() => {
      getAlcohol();
      getMixer();
      getGarnish();
    }, 500);

    setSelectedStock(undefined);
    form.resetFields();
    closeDrawer();
  };

  const handleSubmit = (e: object) => {
    const { name, canDouble, available } = e as AlcoholType & MixerType & GarnishType;
    let formData: AlcoholType | MixerType | GarnishType;
    switch (stockType) {
      case "ALCOHOL":
        formData = {
          name,
          canDouble: canDouble || false,
          available: available || false,
        };

        if (selectedStock?.id) {
          formData.id = selectedStock.id;
          updateAlcohol(formData);
        } else addAlcohol(formData);
        break;
      case "MIXER":
        formData = {
          name,
          available: available || false,
        };

        if (selectedStock?.id) {
          formData.id = selectedStock.id;
          updateMixer(formData);
        } else addMixer(formData);
        break;
      case "GARNISH":
        formData = {
          name,
          available: available || false,
        };

        if (selectedStock?.id) {
          formData.id = selectedStock.id;
          updateGarnish(formData);
        } else addGarnish(formData);
        break;
      default:
        break;
    }
    handleCancel();
  };

  useEffect(() => {
    form.setFieldsValue(selectedStock);
  }, [selectedStock, form]);

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
      <div className="table-section">
        <h3>Alcohol Stock</h3>
        <Table
          columns={alcoholOptionsColumns}
          dataSource={alcohol}
          rowKey="id"
          pagination={false}
          loading={isSaving}
          onRow={(record) => ({
            onClick: () => openDrawer("ALCOHOL", record),
          })}
        />
        <Button onClick={() => openDrawer("ALCOHOL")}>Add Alcohol</Button>
      </div>
      <div className="table-section">
        <h3>Mixer Stock</h3>
        <Table
          columns={optionsColumns}
          dataSource={mixer}
          rowKey="id"
          pagination={false}
          loading={isSaving}
          onRow={(record) => ({
            onClick: () => openDrawer("MIXER", record),
          })}
        />
        <Button onClick={() => openDrawer("MIXER")}>Add Mixer</Button>
      </div>
      <div className="table-section">
        <h3>Garnish Stock</h3>
        <Table
          columns={optionsColumns}
          dataSource={garnish}
          rowKey="id"
          pagination={false}
          loading={isSaving}
          onRow={(record) => ({
            onClick: () => openDrawer("GARNISH", record),
          })}
        />
        <Button onClick={() => openDrawer("GARNISH")}>Add Garnish</Button>
      </div>
      <Drawer
        title={`${stockType} STOCK`}
        placement="right"
        closable={false}
        open={isDrawerVisible}
        extra={
          <Form form={form}>
            <Space>
              {selectedStock && (
                <Button htmlType="submit" type="primary" disabled={isSaving}>
                  Update
                </Button>
              )}
              {!selectedStock && (
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
