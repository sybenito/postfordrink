import React, { useState, useEffect, useContext } from "react";
import type { FC } from "react";
import { getStorage, getDownloadURL, ref, FirebaseStorage } from "firebase/storage";
import type { DocumentData } from "firebase/firestore";
import { Spin, Image } from "antd";
import { FireOutlined, FireFilled } from "@ant-design/icons";
import type { PhotoType } from "src/hooks/Photo";
import AuthContext from "src/store/auth-context";

import "src/components/PhotoFeed/Photo.scss";

interface PhotoProps {
  photo: DocumentData;
  path: string;
  postfix?: string;
  likeAction: (photo: DocumentData, userId: string) => Promise<void | string[]>;
}

const storage: FirebaseStorage = getStorage();

const Photo: FC<PhotoProps> = ({ photo, path, postfix, likeAction }) => {
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
          setPhotoData({ ...photoData, likes } as PhotoType);
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsLiking(false);
      });
  };

  useEffect(() => {
    getDownloadURL(ref(storage, path + photo.id + postfix))
      .then((url) => {
        setPhotoURL(url);
        setPhotoData(photo.data());
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
            <div className="like-count">{likesCount > 0 && <span>{likesCount} Likes</span>}</div>
            <div className="like" onClick={handleLikeAction} onKeyDown={handleLikeAction} role="button" tabIndex={0}>
              {!liked && !isLiking && (
                <>
                  <span>Like </span>
                  <FireOutlined className="like" />
                </>
              )}
              {liked && !isLiking && <FireFilled className="liked" />}
              {isLiking && <Spin />}
            </div>
          </div>
        </>
      )}
      {!photoURL && spinnerElement}
    </>
  );
};

export default Photo;
