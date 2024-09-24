import React, { useState, useEffect, useContext } from "react";
import type { FC } from "react";
import { getStorage, getDownloadURL, ref, FirebaseStorage } from "firebase/storage";
import { Spin, Image, Button } from "antd";
import { FireOutlined, FireFilled, DeleteOutlined } from "@ant-design/icons";
import type { PhotoType } from "src/hooks/Photo";
import type { UserType } from "@/models/user";
import AuthContext from "src/store/auth-context";

import "src/components/PhotoFeed/Photo.scss";

interface PhotoProps {
  photo: PhotoType;
  path: string;
  postfix?: string;
  likeAction: (photo: PhotoType, userId: string) => Promise<void | string[]>;
  deleteAction: (photo: PhotoType, user: UserType) => void;
  userView: boolean;
}

const storage: FirebaseStorage = getStorage();

const Photo: FC<PhotoProps> = ({ photo, path, postfix, likeAction, deleteAction, userView }) => {
  const { user } = useContext(AuthContext);
  const [photoURL, setPhotoURL] = useState<string>("");
  const [photoData, setPhotoData] = useState<PhotoType | null>(null);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>();
  const [isLiking, setIsLiking] = useState<boolean>(false);

  const handleLikeAction = () => {
    setIsLiking(true);
    likeAction(photo, user?.id || "")
      .then((likes) => {
        if (likes) {
          setPhotoData({ ...photo, likes } as PhotoType);
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsLiking(false);
      });
  };

  const handleDelete = () => {
    deleteAction(photo, user as UserType);
  };

  useEffect(() => {
    getDownloadURL(ref(storage, path + photo.id + postfix))
      .then((url) => {
        setPhotoURL(url);
        setPhotoData(photo);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [photo, path, postfix]);

  useEffect(() => {
    if (photoData) {
      setLikesCount(photoData.likes.length);
      setLiked(photoData.likes.includes(user?.id));
    }
  }, [photoData, user]);

  const spinnerElement = (
    <div className="photo-loading">
      <Spin />
    </div>
  );

  return (
    <>
      {photoURL && (
        <>
          <div className="meta">
            <div className="comment">
              <h3 className="owner">{photoData?.createdBy.name}</h3>
              {photoData?.comment}
            </div>
          </div>
          <div className="photo">
            <Image src={photoURL} preview={false} placeholder={spinnerElement} loading="lazy" alt={photo.id} />
          </div>
          <div className="actions">
            {!userView && (
              <>
                <div className="like-count">{likesCount > 0 && <span>{likesCount} Likes</span>}</div>
                <div
                  className="like"
                  onClick={handleLikeAction}
                  onKeyDown={handleLikeAction}
                  role="button"
                  tabIndex={0}
                >
                  {!liked && !isLiking && (
                    <>
                      <span>Like </span>
                      <FireOutlined className="like" />
                    </>
                  )}
                  {liked && !isLiking && <FireFilled className="liked" />}
                  {isLiking && <Spin />}
                </div>
              </>
            )}
            {userView && (
              <Button icon={<DeleteOutlined />} onClick={handleDelete}>
                Delete
              </Button>
            )}
          </div>
        </>
      )}
      {!photoURL && spinnerElement}
    </>
  );
};

export default Photo;
