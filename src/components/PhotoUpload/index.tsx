import React, { useState, useContext } from "react";
import type { FC } from "react";
import type { UploadRequestOption, RcFile } from "rc-upload/lib/interface";
import { CameraOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload, Modal, Divider } from "antd";
import ImgCrop from "antd-img-crop";
import AuthContext from "src/store/auth-context";
import type { AuthContextType } from "src/hooks/Auth";
import PhotoUploadAction from "src/components/PhotoUpload/PhotoUploadAction";
import usePhoto from "src/hooks/Photo";
import "./index.scss";

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
        console.error(e);
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
    <div className="photo-upload">
      <div className="intro">
        <h1>Post a Photo! Join Us For a Drink.</h1>
        <p>
          Our bar is <strong>open</strong> for our guests. In exchange for one drink pass, we ask for one photo post.
          There is no limit to this as long as our bar is still standing.
        </p>
        <p>All approved photos will end up in the photo feed, so lets see those big smiles! </p>
      </div>
      <Divider />
      {fb && (
        <div className="action">
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
              <div className="button-container">
                <Upload
                  name="photo"
                  listType="picture-card"
                  className="photo-uploader-button"
                  showUploadList={false}
                  accept="image/*"
                  capture="environment"
                  customRequest={handleSelectPhoto}
                  maxCount={1}
                  disabled={isUploading}
                >
                  <PlusOutlined />
                  {!isUploading && <CameraOutlined />}
                  {isUploading && <CameraOutlined spin />}
                </Upload>
              </div>
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
