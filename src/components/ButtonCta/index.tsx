import React from "react";
import type { FC } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import "./index.scss";

interface ButtonCtaProps {
  title: string;
  action: () => void;
  icon: React.ReactNode;
}

const ButtonCta: FC<ButtonCtaProps> = ({ title, action, icon }) => (
  <div className="button-cta">
    <div className="label">{title}</div>
    <Button type="default" onClick={action}>
      <span>
        <PlusOutlined />
        {icon}
      </span>
    </Button>
  </div>
);

export default ButtonCta;
