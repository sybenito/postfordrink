import React, { useContext } from "react";
import type { FC } from "react";
import { Spin, Tabs } from "antd";
import type { TabsProps } from "antd";
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

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Photo Feed",
      children: <PhotoFeed />,
    },
    {
      key: "2",
      label: "Your Posts",
      children: <PhotoFeed />,
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
              <p>Post a photo and recieve 2 drink passes each photo. Then scan your order at the Bar.</p>
              <p>Lets capture this moment together.</p>
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
