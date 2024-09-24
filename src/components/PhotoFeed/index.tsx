import React, { useEffect } from "react";
import type { FC } from "react";
import { Spin, Empty, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { UserType } from "src/models/user";
import usePhoto from "src/hooks/Photo";
import Photo from "src/components/PhotoFeed/Photo";
import type { PhotoType } from "src/hooks/Photo";

import "src/components/PhotoFeed/index.scss";

interface PhotoFeedProps {
  user?: UserType;
}

const PHOTO_BASE_PATH = "photos/resized/450/";
const PHOTO_POSTFIX = "_450x450";

const PhotoFeed: FC<PhotoFeedProps> = ({ user }) => {
  const { getPhotos, photos, isPhotoLoading, toggleLike, deletePhoto } = usePhoto();

  const handleLikeAction = (photo: PhotoType, userId: string) => toggleLike(photo, userId);

  const handleDeletePhoto = (photo: PhotoType, deletUser: UserType) => {
    Modal.confirm({
      title: "Delete this photo?",
      okButtonProps: { icon: <DeleteOutlined /> },
      okText: "Delete Photo",
      onOk: () => deletePhoto(photo, deletUser),
    });
  };

  useEffect(() => {
    getPhotos(user);
  }, [getPhotos, user]);

  return (
    <div className="photo-feed">
      {isPhotoLoading && <Spin />}
      {!isPhotoLoading && photos.length === 0 && <Empty description={false} />}
      {!isPhotoLoading && photos.length > 0 && (
        <div className="feed-container">
          {photos.map((p) => (
            <div className="item" key={p.id}>
              <Photo
                photo={p}
                path={PHOTO_BASE_PATH}
                postfix={PHOTO_POSTFIX}
                likeAction={handleLikeAction}
                deleteAction={handleDeletePhoto}
                userView={!!user}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoFeed;
