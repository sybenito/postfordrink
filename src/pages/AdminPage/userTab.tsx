import React, { useState, useEffect } from "react";
import type { FC } from "react";
import { Drawer, Button, Form, Input, InputNumber, Space, Table, TableProps, Select } from "antd";
import useUsers from "src/hooks/Users";
import type { UserType } from "src/models/user";

const optionsColumns: TableProps<UserType>["columns"] = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    ellipsis: true,
  },
  {
    title: "User Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Tickets",
    dataIndex: "tickets",
    key: "tickets",
  },
];

const UserTab: FC = () => {
  const [form] = Form.useForm();
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const { getUsers, updateUser, users, userTypes, isSaving } = useUsers();
  const [selectedUser, setSelectedUser] = useState<UserType>();

  const openDrawer = (user: UserType) => {
    setSelectedUser(user);
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => setIsDrawerVisible(false);

  const handleCancel = () => {
    form.resetFields();
    setSelectedUser(undefined);
    closeDrawer();
  };

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    const updatedUser = { ...selectedUser, ...values };
    updateUser(updatedUser);
    handleCancel();
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    form.setFieldsValue(selectedUser || {});
  }, [selectedUser, form]);

  const userForm = (
    <Form form={form} name="bar-stock" onFinish={handleSubmit}>
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input maxLength={50} disabled={isSaving} />
      </Form.Item>
      <Form.Item name="tickets" label="Tickets" rules={[{ required: true }]}>
        <InputNumber min={0} disabled={isSaving} />
      </Form.Item>
      <Form.Item name="type" label="User Type" rules={[{ required: true }]}>
        <Select
          disabled={isSaving}
          options={userTypes.map((t) => ({ label: t, value: t }))}
          value={selectedUser?.type}
        />
      </Form.Item>
    </Form>
  );

  return (
    <div className="user-editor">
      <div className="table-section">
        <h3>Users</h3>
        <Table
          columns={optionsColumns}
          dataSource={users}
          rowKey="id"
          loading={isSaving}
          pagination={false}
          onRow={(record) => ({
            onClick: () => openDrawer(record),
          })}
        />
      </div>
      <Drawer
        title="Edit User"
        placement="right"
        closable={false}
        open={isDrawerVisible}
        extra={
          <Form form={form}>
            <Space>
              <Button htmlType="submit" type="primary" disabled={isSaving}>
                Update
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form>
        }
      >
        {userForm}
      </Drawer>
    </div>
  );
};

export default UserTab;
