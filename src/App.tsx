import React, {useMemo} from "react";
import type { FC } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthContext from "src/store/auth-context";
import useAuth from "src/hooks/Auth";
import Header from "src/components/Header";
import SignIn from "src/components/SignIn";
import PhotoUpload from "src/components/PhotoUpload";
import QRCodeScanner from "src/components/QrCodeScanner";
import Error from "src/components/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
    errorElement: <Error />,
  },
  {
    path: "/upload-photo",
    element: <PhotoUpload />,
  },
  {
    path: "/qr-scanner",
    element: <QRCodeScanner />,
  },
]);

const App: FC = () => {
  const { isSignedIn, user, fb } = useAuth();
  const authContextMemo = useMemo(() => ({ isSignedIn, user, fb }), [isSignedIn, user, fb]);

  return (
    <div className="App">
      {fb && (
      <AuthContext.Provider value={authContextMemo}>
        <Header />
        <main className="App-header">
          <RouterProvider router={router} />
        </main>
      </AuthContext.Provider>
      )}
    </div>
  );
};
export default App;
