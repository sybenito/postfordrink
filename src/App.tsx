import React, { useMemo } from "react";
import type { FC } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthContext from "src/store/auth-context";
import useAuth, { UserTypeEnum } from "src/hooks/Auth";
import Error from "src/components/Error";
import MainLayout from "src/layouts/MainLayout";
import HomePage from "src/pages/HomePage";
import RegisteredPage from "src/pages/RegisteredPage";
import PhotoUploadPage from "src/pages/PhotoUploadPage";
import OrderPage from "src/pages/OrderPage";
import BartenderPage from "src/pages/BartenderPage";

type UserRoutesType = {
  [key in UserTypeEnum]: {
    path: string;
    element: JSX.Element;
    errorElement?: JSX.Element;
  }[];
};
const userRoutes: UserRoutesType = {
  guest: [
    {
      path: "/",
      element: <HomePage />,
      errorElement: <Error />,
    },
    {
      path: "/registered",
      element: <RegisteredPage />,
    },
    {
      path: "/photo-upload",
      element: <PhotoUploadPage />,
    },
    {
      path: "/order",
      element: <OrderPage />,
    },
    {
      path: "*",
      element: <Error />,
    },
  ],
  bar: [
    {
      path: "/",
      element: <BartenderPage />,
    },
    {
      path: "/registered",
      element: <RegisteredPage />,
    },
    {
      path: "*",
      element: <Error />,
    },
  ],
  host: [
    {
      path: "/",
      element: <HomePage />,
      errorElement: <Error />,
    },
    {
      path: "/registered",
      element: <RegisteredPage />,
    },
    {
      path: "*",
      element: <Error />,
    },
  ],
  default: [
    {
      path: "/",
      element: <HomePage />,
      errorElement: <Error />,
    },
    {
      path: "/registered",
      element: <RegisteredPage />,
    },
    {
      path: "*",
      element: <Error />,
    },
  ],
};

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
            <RouterProvider router={createBrowserRouter(userRoutes[user.type ?? "default"])} />
          </MainLayout>
        </AuthContext.Provider>
      )}
    </div>
  );
};
export default App;
