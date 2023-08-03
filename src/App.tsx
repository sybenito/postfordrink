import React from "react";
import type { FC } from "react";
import useAuth from "./hooks/Auth";
import Header from "./components/Header";
import SignIn from "./components/SignIn";
import PhotoUpload from "./components/PhotoUpload";

const App: FC = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="App">
      <Header />
      <main className="App-header">
        <h1>Upload a Photo</h1>
        {isSignedIn === false && <SignIn />}
        {isSignedIn === true && <PhotoUpload />}
      </main>
    </div>
  );
};
export default App;
