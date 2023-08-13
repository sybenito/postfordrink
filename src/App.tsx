import React, { useMemo } from "react";
import type { FC } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthContext from "src/store/auth-context";
import useAuth from "src/hooks/Auth";
import Error from "src/components/Error";
import MainLayout from "src/layouts/MainLayout";
import HomePage from "src/pages/HomePage";
import RegisteredPage from "src/pages/RegisteredPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <Error />,
  },
  {
    path: "/registered",
    element: <RegisteredPage />,
  },
]);

const App: FC = () => {
  const { isSignedIn, user, fb, isUserLoading } = useAuth();
  const authContextMemo = useMemo(
    () => ({ isSignedIn, user, fb, isUserLoading }),
    [isSignedIn, user, fb, isUserLoading]
  );

  return (
    <div className="App">
      {fb && (
        <AuthContext.Provider value={authContextMemo}>
          <MainLayout>
            <RouterProvider router={router} />
          </MainLayout>
        </AuthContext.Provider>
      )}
    </div>
  );
};
export default App;
