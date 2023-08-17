import React from "react";
import type { FC } from "react";
import PhotoUpload from "src/components/PhotoUpload";
import useAuthProtect from "src/hooks/AuthProtect";

const PhotoUploadPage: FC = () => {
  useAuthProtect().validateAuth();

  return (
    <div className="photo-upload">
      <PhotoUpload />
    </div>
  );
};

export default PhotoUploadPage;
