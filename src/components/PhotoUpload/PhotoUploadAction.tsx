import React from "react";
import type { FC } from "react";
import { Button, Input, Spin } from "antd";

interface PhotoUploadActionProps {
  photo: string | Blob | null;
  photoComment: string;
  handleCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleUploadPhoto: (file: string | Blob) => void;
  handleCancel: () => void;
  isUploading: boolean;
}

const PhotoUploadAction: FC<PhotoUploadActionProps> = ({
  photo,
  photoComment,
  handleCommentChange,
  handleUploadPhoto,
  handleCancel,
  isUploading,
}) => (
  <div className="upload-action">
    {photo && (
      <div className="upload-img-container">
        <img src={typeof photo === "string" ? photo : URL.createObjectURL(photo)} alt="Uploaded" />
        {isUploading && (
          <div className="overlay">
            <Spin />
          </div>
        )}
      </div>
    )}
    <Input.TextArea
      placeholder="Enter a comment..."
      value={photoComment}
      onChange={handleCommentChange}
      maxLength={144}
      autoSize={{ minRows: 2, maxRows: 2 }}
      disabled={isUploading}
    />
    <Button type="default" onClick={handleCancel} loading={isUploading}>
      Cancel
    </Button>
    <Button
      type="primary"
      onClick={() => {
        if (photo) handleUploadPhoto(photo);
      }}
      disabled={!photo}
      loading={isUploading}
    >
      Upload
    </Button>
  </div>
);

export default PhotoUploadAction;
