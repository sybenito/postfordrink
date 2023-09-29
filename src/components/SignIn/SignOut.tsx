import React, { useContext, useState } from "react";
import type { FC } from "react";
import type { MenuProps } from "antd";
import { Button, Avatar, Modal, Dropdown } from "antd";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { UserOutlined } from "@ant-design/icons";
import AuthContext from "src/store/auth-context";
import type { AuthContextType } from "src/hooks/Auth";

import "firebaseui/dist/firebaseui.css";

const SignOut: FC = () => {
  const { user } = useContext<AuthContextType>(AuthContext);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState<boolean>(false);

  const handleOpenLogoutConfirm = () => {
    setIsLogoutModalVisible(true);
  };

  const handleLogout = () => {
    firebase.auth().signOut();
    setIsLogoutModalVisible(false);
    document.location.href = "/";
  };

  const items: MenuProps["items"] = [
    {
      label: <Button onClick={handleOpenLogoutConfirm}>Sign Out</Button>,
      key: "0",
    },
  ];

  return (
    <div className="sign-out">
      <Dropdown trigger={["click"]} placement="bottom" menu={{ items }}>
        <div className="user-avatar">
          {user && user.photoURL ? <Avatar src={user.photoURL} /> : <Avatar size="large" icon={<UserOutlined />} />}
        </div>
      </Dropdown>
      <Modal
        title="Sign Out"
        open={isLogoutModalVisible}
        onOk={handleLogout}
        okText="Yes, Sign Me Out"
        onCancel={() => setIsLogoutModalVisible(false)}
      >
        <p>Are you sure you want to sign out?</p>
      </Modal>
    </div>
  );
};

export default SignOut;
