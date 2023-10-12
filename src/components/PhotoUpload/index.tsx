import React, { useState, useContext } from "react";
import type { FC } from "react";
import type { UploadRequestOption, RcFile } from "rc-upload/lib/interface";
import { CameraOutlined } from "@ant-design/icons";
import { Upload, Modal } from "antd";
import ImgCrop from "antd-img-crop";
import AuthContext from "src/store/auth-context";
import type { AuthContextType } from "src/hooks/Auth";
import PhotoUploadAction from "src/components/PhotoUpload/PhotoUploadAction";
import usePhoto from "src/hooks/Photo";

const PhotoUpload: FC = () => {
  const { fb, user } = useContext<AuthContextType>(AuthContext);
  const { photoComment, setPhotoComment, uploadPhoto, isUploading, createPhotoMetadata, resetPhotoId } = usePhoto();

  const [isCancelModalVisible, setIsCancelModalVisible] = useState<boolean>(false);
  const [photo, setPhoto] = useState<RcFile | string | RcFile | Blob | null>(null);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPhotoComment(e.target.value);
  };

  const handleUploadPhoto = async (file: RcFile | string | Blob) => {
    if (user) {
      try {
        await uploadPhoto(file);
        await createPhotoMetadata(user);
        setPhoto(null);
        resetPhotoId();
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleSelectPhoto = (file: UploadRequestOption) => {
    setPhoto(file.file);
  };

  const confirmCancel = () => {
    setIsCancelModalVisible(true);
  };

  const handleCancel = () => {
    setPhoto(null);
    setPhotoComment("");
    setIsCancelModalVisible(false);
  };

  return (
    <div className="main">
      {fb && (
        <div className="photo-upload">
          <ImgCrop modalClassName="photo-upload-modal" quality={0.7} aspectSlider fillColor="transparent" showReset>
            {photo ? (
              <PhotoUploadAction
                photo={photo}
                photoComment={photoComment}
                handleCommentChange={handleCommentChange}
                handleUploadPhoto={handleUploadPhoto}
                handleCancel={confirmCancel}
                isUploading={isUploading}
              />
            ) : (
              <Upload
                name="photo"
                listType="picture-card"
                className="photo-uploader"
                showUploadList={false}
                accept="image/*"
                capture="environment"
                customRequest={handleSelectPhoto}
                maxCount={1}
                disabled={isUploading}
              >
                {!isUploading && <CameraOutlined />}
                {isUploading && <CameraOutlined spin />}
              </Upload>
            )}
          </ImgCrop>
        </div>
      )}
      <Modal
        title="Cancel Photo Upload"
        open={isCancelModalVisible}
        onOk={handleCancel}
        okText="Yes, Cancel Upload"
        cancelText="No, Keep This Photo"
        onCancel={() => setIsCancelModalVisible(false)}
      >
        <p>Are you sure you want to cancel this photo upload?</p>
      </Modal>
    </div>
  );
};

export default PhotoUpload;
