import React, {useState} from "react";
import type { FC } from "react";
import { useZxing } from "react-zxing";
import useAuth from "./hooks/Auth";
import Header from "./components/Header";
import SignIn from "./components/SignIn";
import PhotoUpload from "./components/PhotoUpload";

const App: FC = () => {
  const { isSignedIn } = useAuth();
  const [qrCode, setQrCode] = useState<string>("");
  const { ref } = useZxing({
    onResult(result) {
    setQrCode(result.getText());
    },
  });

  return (
    <div className="App">
      <Header />
      <main className="App-header">
        <h1>Upload a Photo</h1>
        {isSignedIn === false && <SignIn />}
        {isSignedIn === true && <PhotoUpload />}
        {isSignedIn === true && (
        <video autoPlay ref={ref}><track kind="captions"/></video>        
        )}
        {qrCode && <p>{qrCode}</p>}
      </main>
    </div>
  );
};
export default App;
