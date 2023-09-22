import React from "react";
import type { FC } from "react";
import { Spin } from "antd";
import SignIn from "src/components/SignIn";
import AuthContext from "src/store/auth-context";
import PhotoFeed from "src/components/PhotoFeed";
import MainNav from "src/components/MainNav";

const HomePage: FC = () => {
  const { isSignedIn } = React.useContext(AuthContext);

  return (
    <div id="home-page">
      {isSignedIn === true && (
        <>
          <h1>Welcome!</h1>
          <PhotoFeed />
        </>
      )}
      {isSignedIn === false && <SignIn />}
      {isSignedIn === null && <Spin />}
      <MainNav />
    </div>
  );
};
export default HomePage;
