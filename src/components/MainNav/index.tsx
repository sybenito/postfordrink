import React from "react";
import type { FC } from "react";
import { FloatButton } from "antd";

interface MainNavItem {
  name: string;
  icon: JSX.Element;
  action: () => void;
}

interface MainNavProps {
  nav: MainNavItem[];
}

const MainNav: FC<MainNavProps> = (props) => {
  const { nav } = props;

  const renderNav = () => nav.map((item) => <FloatButton key={item.name} icon={item.icon} onClick={item.action} />);

  return (
    <div id="main-nav">
      <FloatButton.Group>
        {renderNav()}
        <FloatButton.BackTop />
      </FloatButton.Group>
    </div>
  );
};

export default MainNav;
export type { MainNavItem };
