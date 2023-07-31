import React from "react";
import type { FC } from "react";
import AuthContext from "./store/auth-context";
import useAuth from "./hooks/Auth";

const App: FC = () => {
  const { isSignedIn, user, fb } = useAuth();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Drinks!</h1>
      </header>
    </div>
  );
};
export default App;
