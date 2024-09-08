import React, { useContext } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { FloatButton } from "antd";
import { HomeOutlined, CameraOutlined, RocketOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { UserTypeEnum } from "src/models/user";
import AuthContext from "src/store/auth-context";

interface MainNavItem {
  name: string;
  icon: JSX.Element;
  action: () => void;
}

type MainNavType = {
  [key in UserTypeEnum]: MainNavItem[];
};

const MainNav: FC = () => {
  const { user } = useContext(AuthContext);
  const routerNav = useNavigate();
  const navigate = (path: string) => {
    routerNav(path);
  };

  const mainNav: MainNavType = {
    [UserTypeEnum.GUEST]: [
      {
        name: "Home",
        icon: <HomeOutlined />,
        action: () => navigate("/"),
      },
      {
        name: "Upload Photo",
        icon: <CameraOutlined />,
        action: () => navigate("/photo-upload"),
      },
      {
        name: "Order",
        icon: <RocketOutlined />,
        action: () => navigate("/order"),
      },
    ],
    [UserTypeEnum.BAR]: [
      {
        name: "Home",
        icon: <HomeOutlined />,
        action: () => navigate("/"),
      },
    ],
    [UserTypeEnum.HOST]: [
      {
        name: "Home",
        icon: <HomeOutlined />,
        action: () => navigate("/"),
      },
      {
        name: "Upload Photo",
        icon: <CameraOutlined />,
        action: () => navigate("/photo-upload"),
      },
      {
        name: "Order",
        icon: <RocketOutlined />,
        action: () => navigate("/order"),
      },
      {
        name: "Admin",
        icon: <UsergroupAddOutlined />,
        action: () => navigate("/admin"),
      },
    ],
    [UserTypeEnum.DEFAULT]: [
      {
        name: "Home",
        icon: <HomeOutlined />,
        action: () => navigate("/"),
      },
    ],
  };
  const nav = mainNav[user.type];
  const renderNav = () => nav.map((item) => <FloatButton key={item.name} icon={item.icon} onClick={item.action} />);

  return (
    <div id="main-nav">
      <FloatButton.Group>
        {renderNav()}
        <FloatButton.BackTop />
      </FloatButton.Group>
    </div>
  );
};

export default MainNav;
export type { MainNavItem };
