import "../styles/Header.scss";
import React, { useContext } from "react";
import type { FC } from "react";
import SignIn from "./SignIn";
import AuthContext from "../store/auth-context";
import type { AuthContextType } from "../hooks/Auth";

const Header: FC = () => {
  const authContext = useContext<AuthContextType>(AuthContext);

  return (
    <header className="app-header">
      <div className="logo">
        <h1>Post n Drink</h1>
        {authContext.isSignedIn && <span className="user-name">&#8212;&nbsp; {authContext.user?.displayName}</span>}
      </div>
      <div className="login-action">
        <SignIn />
      </div>
    </header>
  );
};

export default Header;
