import React from "react";
import type { FC } from "react";
import Header from "src/components/Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
  </>
);

export default MainLayout;
