import "../../styles/Header.scss";
import React, { useContext } from "react";
import SignIn from "../SignIn";
import AuthContext from "../../store/auth-context";

function Header() {
  const authContext = useContext(AuthContext);

  return (
    <div className="app-header">
      <div className="logo">
        <h1>TaskBan</h1>
        {authContext.isSignedIn && (
          <span className="user-name">
            &#8212;&nbsp; {authContext.user.displayName}
          </span>
        )}
      </div>
      <div className="login-action">
        <SignIn />
      </div>
    </div>
  );
}

export default Header;
