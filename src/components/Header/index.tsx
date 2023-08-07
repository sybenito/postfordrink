import "src/components/Header/Header.scss";
import React, { useContext } from "react";
import type { FC } from "react";
import SignOut from "src/components/SignIn/SignOut";
import AuthContext from "src/store/auth-context";
import type { AuthContextType } from "src/hooks/Auth";

const Header: FC = () => {
  const authContext = useContext<AuthContextType>(AuthContext);

  return (
    <header className="app-header">
      <div className="logo">
        <h1>
          <a href="/">Post for Drinks</a>
        </h1>
        {authContext.isSignedIn && authContext.user?.displayName && (
          <span className="user-name">&#8212;&nbsp; {authContext.user?.displayName}</span>
        )}
      </div>
      <div className="login-action">{authContext.isSignedIn === true && <SignOut />}</div>
    </header>
  );
};

export default Header;
