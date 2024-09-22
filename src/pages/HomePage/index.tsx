import React, { useContext } from "react";
import type { FC } from "react";
import { Spin, Tabs, Button } from "antd";
import type { TabsProps } from "antd";
import { useNavigate } from "react-router-dom";
import { CameraOutlined } from "@ant-design/icons";
import SignIn from "src/components/SignIn";
import AuthContext from "src/store/auth-context";
import PhotoFeed from "src/components/PhotoFeed";
import MainNav from "src/components/MainNav";
import useAuthProtect from "src/hooks/AuthProtect";
import type { AuthContextType } from "src/hooks/Auth";
import { UserTypeEnum } from "src/models/user";

import "src/pages/HomePage/index.scss";

const HomePage: FC = () => {
  useAuthProtect().validateAuth();
  const authContext = useContext<AuthContextType>(AuthContext);
  const { isSignedIn } = React.useContext(AuthContext);

  const routerNav = useNavigate();

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Photo Feed",
      children: <PhotoFeed />,
    },
    {
      key: "2",
      label: "Your Posts",
      children: <PhotoFeed user={authContext.user} />,
    },
  ];

  return (
    <div id="home-page">
      {isSignedIn === true && (
        <div className="feed-container">
          {authContext.user.type !== UserTypeEnum.HOST && (
            <div className="welcome-message">
              {authContext.isSignedIn && authContext.user?.name && <h1>Welcome {authContext.user?.name}!</h1>}
              <p>We want to share this moment from your point-of-view.</p>
              <div className="action-section">
                <Button type="default" onClick={() => routerNav("/photo-upload")} icon={<CameraOutlined />}>
                  Post a Photo
                </Button>
                <div className="info">Recieve 2 drink passes for each photo.</div>
              </div>
              <div className="action-section">
                <Button type="default" onClick={() => routerNav("/order")} icon={<span className="drink-icon" />}>
                  Order a Drink
                </Button>
                <div className="info">App orders will be made priority at the bar.</div>
              </div>
            </div>
          )}
          <Tabs items={tabItems} />
        </div>
      )}
      {isSignedIn === false && <SignIn />}
      {isSignedIn === null && <Spin />}
      <MainNav />
    </div>
  );
};
export default HomePage;
