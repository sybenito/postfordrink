import React, { useContext, useState } from "react";
import type { FC } from "react";
import { Button, Avatar, Modal } from "antd";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import AuthContext from "../../store/auth-context";
import type { AuthContextType } from "../../hooks/Auth";

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
  };

  return (
    <div className="sign-out">
      <Button onClick={handleOpenLogoutConfirm}>Sign-out</Button>
      {user && <Avatar src={user.photoURL} />}
      <Modal
        title="Log Out"
        open={isLogoutModalVisible}
        onOk={handleLogout}
        okText="Yes, Log Out"
        onCancel={() => setIsLogoutModalVisible(false)}
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </div>
  );
};

export default SignOut;
