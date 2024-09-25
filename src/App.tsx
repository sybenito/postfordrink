import React, { useMemo } from "react";
import type { FC } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Spin, ConfigProvider } from "antd";
import AuthContext from "src/store/auth-context";
import useAuth from "src/hooks/Auth";
import { UserTypeEnum } from "src/models/user";
import Error from "src/components/Error";
import MainLayout from "src/layouts/MainLayout";
import HomePage from "src/pages/HomePage";
import RegisteredPage from "src/pages/RegisteredPage";
import PhotoUploadPage from "src/pages/PhotoUploadPage";
import OrderPage from "src/pages/OrderPage";
import BartenderPage from "src/pages/BartenderPage";
import THEME_CONFIG from "src/theme.config";
import AdminPage from "src/pages/AdminPage";
import SignIn from "./components/SignIn";

import "src/styles/App.scss";

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
      errorElement: <SignIn />,
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
      element: <SignIn />,
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
      element: <SignIn />,
    },
  ],
  host: [
    {
      path: "/",
      element: <HomePage />,
      errorElement: <SignIn />,
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
      path: "/admin",
      element: <AdminPage />,
    },
    {
      path: "*",
      element: <SignIn />,
    },
  ],
  default: [
    {
      path: "/",
      element: <HomePage />,
      errorElement: <SignIn />,
    },
    {
      path: "/registered",
      element: <RegisteredPage />,
    },
    {
      path: "/photo-upload",
      element: <Spin />,
    },
    {
      path: "/order",
      element: <Spin />,
    },
    {
      path: "*",
      element: <SignIn />,
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
    <ConfigProvider theme={THEME_CONFIG}>
      <div className="App">
        {fb && (
          <AuthContext.Provider value={authContextMemo}>
            <MainLayout>
              <RouterProvider router={createBrowserRouter(userRoutes[user.type ?? "default"])} />
            </MainLayout>
          </AuthContext.Provider>
        )}
      </div>
    </ConfigProvider>
  );
};
export default App;
