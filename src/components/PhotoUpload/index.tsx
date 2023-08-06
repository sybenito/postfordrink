import React, { useState } from "react";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";
import type { UploadRequestOption } from "rc-upload/lib/interface";
import { CameraOutlined } from "@ant-design/icons";
import { Upload, message } from "antd";
import ImgCrop from "antd-img-crop";
import useAuth from "src/hooks/Auth";

const storage: FirebaseStorage = getStorage();

const PhotoUpload = () => {
  const { fb } = useAuth();
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleUpload = (file: UploadRequestOption) => {
    const storageRef = ref(storage, "photos/photo.jpg");
    setIsUploading(true);
    uploadBytesResumable(storageRef, file.file as Blob)
      .then(() => {
        message.success("Photo uploaded!");
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  return (
    <div className="main">
      {fb && (
        <div className="photo-upload">
          <ImgCrop>
            <Upload
              name="photo"
              listType="picture-card"
              className="photo-uploader"
              showUploadList={false}
              accept="image/*"
              capture="environment"
              customRequest={handleUpload}
              maxCount={1}
              disabled={isUploading}
            >
              {!isUploading && <CameraOutlined />}
              {isUploading && <CameraOutlined spin />}
            </Upload>
          </ImgCrop>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
