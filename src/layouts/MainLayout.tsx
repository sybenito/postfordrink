import React, { useContext } from "react";
import type { FC } from "react";
import { HomeOutlined, CameraOutlined, RocketOutlined } from "@ant-design/icons";
import Header from "src/components/Header";
import MainNav from "src/components/MainNav";
import type { MainNavItem } from "src/components/MainNav";
import AuthContext from "src/store/auth-context";
import { UserTypeEnum } from "src/hooks/Auth";

type MainNavType = {
  [key in UserTypeEnum]: MainNavItem[];
};

const navigate = (path: string) => {
  document.location.href = path;
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
  ],
};

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const nav = mainNav[user.type];
  return (
    <>
      <Header />
      <main>{children}</main>
      <div className="floating-nav">
        <MainNav nav={nav} />
      </div>
    </>
  );
};

export default MainLayout;
