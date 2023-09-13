import React, { useState, useEffect } from "react";
import type { FC } from "react";
import { getStorage, getDownloadURL, ref, FirebaseStorage } from "firebase/storage";
import type { DocumentData } from "firebase/firestore";
import { Spin, Image } from "antd";

interface PhotoProps {
  photo: DocumentData;
  width: number;
  path: string;
}

const storage: FirebaseStorage = getStorage();

const Photo: FC<PhotoProps> = ({ photo, width, path }) => {
  const [photoURL, setPhotoURL] = useState<string>("");

  useEffect(() => {
    getDownloadURL(ref(storage, path + photo.id))
      .then((url) => {
        setPhotoURL(url);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [photo, path]);

  return (
    <>
      {photoURL && (
        <Image src={photoURL} width={width} preview={false} placeholder={<Spin />} loading="lazy" alt={photo.id} />
      )}
      {!photoURL && <Spin />}
    </>
  );
};

export default Photo;
