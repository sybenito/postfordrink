import React from "react";
import type { FC } from "react";
import AuthContext from "./store/auth-context";
import useAuth from "./hooks/Auth";
import Header from "./components/Header";

const App: FC = () => {
  const { isSignedIn, user, fb } = useAuth();

  return (
    <div className="App">
      <Header />
      <main className="App-header">
        <h1>Drinks!</h1>
      </main>
    </div>
  );
};
export default App;
