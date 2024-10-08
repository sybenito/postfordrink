import React, { useContext } from "react";
import type { FC } from "react";
import { Tabs, TabsProps } from "antd";
import AuthContext from "src/store/auth-context";
import useAuthProtect from "src/hooks/AuthProtect";
import BarTab from "./barTab";
import UserTab from "./userTab";

const AdminPage: FC = () => {
  useAuthProtect().validateAuth();
  const { user } = useContext(AuthContext);

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Bar Stock",
      children: <BarTab />,
    },
    {
      key: "2",
      label: "Users",
      children: <UserTab />,
    },
  ];

  return (
    <div className="admin-page content-section">
      <div className="header">
        <h1 className="small">
          Hello, {user.name}.<br />
          Let&apos;s Admin
        </h1>
      </div>
      <div className="admin">
        <Tabs items={tabItems} />
      </div>
    </div>
  );
};

export default AdminPage;
