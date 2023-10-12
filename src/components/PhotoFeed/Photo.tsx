import React, { useState, useEffect } from "react";
import type { FC } from "react";
import { getStorage, getDownloadURL, ref, FirebaseStorage } from "firebase/storage";
import type { DocumentData } from "firebase/firestore";
import { Spin, Image } from "antd";
import { FireOutlined, FireTwoTone } from "@ant-design/icons";
import type { PhotoType } from "src/hooks/Photo";

interface PhotoProps {
  photo: DocumentData;
  path: string;
  postfix?: string;
}

const storage: FirebaseStorage = getStorage();

const Photo: FC<PhotoProps> = ({ photo, path, postfix }) => {
  const [photoURL, setPhotoURL] = useState<string>("");
  const [photoData, setPhotoData] = useState<PhotoType | null>(null);

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

  return (
    <>
      {photoURL && (
        <>
          <div className="meta">
            <div className="comment">
              <div className="owner">{photoData?.createdBy.name}</div>
              {photoData?.comment}
            </div>
          </div>
          <div className="photo">
            <Image src={photoURL} preview={false} placeholder={<Spin />} loading="lazy" alt={photo.id} />
          </div>
          <div className="actions">
            <div className="like-count">
              <span>10 Likes</span>
            </div>
            <div className="like">
              <span>Like </span>
              <FireOutlined />
            </div>
          </div>
        </>
      )}
      {!photoURL && <Spin />}
    </>
  );
};

export default Photo;
