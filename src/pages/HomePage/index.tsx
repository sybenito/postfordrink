import React from "react";
import type { FC } from "react";
import { Spin } from "antd";
import SignIn from "src/components/SignIn";
import AuthContext from "src/store/auth-context";
import PhotoUpload from "src/components/PhotoUpload";

const HomePage: FC = () => {
  const { isSignedIn } = React.useContext(AuthContext);

  return (
    <div id="home-page">
      {isSignedIn === true && (
        <>
          <h1>Welcome!</h1>
          <PhotoUpload />
        </>
      )}
      {isSignedIn === false && <SignIn />}
      {isSignedIn === null && <Spin />}
    </div>
  );
};
export default HomePage;
