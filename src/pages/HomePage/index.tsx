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
          <div className="welcome-message">
            {authContext.isSignedIn && authContext.user?.name && <h1>Welcome {authContext.user?.name}!</h1>}

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </p>
          </div>
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
