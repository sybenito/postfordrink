import "../styles/Header.scss";
import React, { useContext } from "react";
import type { FC } from "react";
import SignOut from "./SignOut";
import useAuth from "../hooks/Auth";
import AuthContext from "../store/auth-context";
import type { AuthContextType } from "../hooks/Auth";

const Header: FC = () => {
  const authContext = useContext<AuthContextType>(AuthContext);
  const { isSignedIn } = useAuth();

  return (
    <header className="app-header">
      <div className="logo">
        <h1>Post for Drinks</h1>
        {authContext.isSignedIn && <span className="user-name">&#8212;&nbsp; {authContext.user?.displayName}</span>}
      </div>
      <div className="login-action">{isSignedIn === true && <SignOut />}</div>
    </header>
  );
};

export default Header;
