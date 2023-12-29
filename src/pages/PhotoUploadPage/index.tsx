import React from "react";
import type { FC } from "react";
import PhotoUpload from "src/components/PhotoUpload";
import useAuthProtect from "src/hooks/AuthProtect";
import MainNav from "src/components/MainNav";

const PhotoUploadPage: FC = () => {
  useAuthProtect().validateAuth();

  return (
    <div className="photo-upload-page">
      <PhotoUpload />
      <MainNav />
    </div>
  );
};

export default PhotoUploadPage;
