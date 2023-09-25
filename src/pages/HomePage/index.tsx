import React from "react";
import type { FC } from "react";
import { Spin } from "antd";
import SignIn from "src/components/SignIn";
import AuthContext from "src/store/auth-context";
import PhotoFeed from "src/components/PhotoFeed";
import MainNav from "src/components/MainNav";
import useAuthProtect from "src/hooks/AuthProtect";

const HomePage: FC = () => {
  useAuthProtect().validateAuth();
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
