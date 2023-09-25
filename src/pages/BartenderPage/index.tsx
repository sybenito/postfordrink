import React, { useContext } from "react";
import type { FC } from "react";
import AuthContext from "src/store/auth-context";
import QRCodeScanner from "src/components/QrCodeScanner";
import useAuthProtect from "src/hooks/AuthProtect";

const BartenderPage: FC = () => {
  useAuthProtect().validateAuth();
  const { user } = useContext(AuthContext);
  return (
    <div className="bar-page">
      <div className="header">
        <h1>
          Hello, {user.name}.<br />
          Let&apos;s Rock n Roll.
        </h1>
      </div>
      <div className="order">
        <QRCodeScanner />
      </div>
    </div>
  );
};

export default BartenderPage;
