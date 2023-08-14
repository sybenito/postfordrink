import { useState } from "react";
import type { RcFile } from "rc-upload/lib/interface";
import { v4 as uuid } from "uuid";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";
import { getFirestore, doc, setDoc, serverTimestamp, FieldValue } from "firebase/firestore";
import { message } from "antd";
import type { UserType } from "src/hooks/Auth";

enum PhotoStatusEnum {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  DELETED = "deleted",
}

interface PhotoType {
  id: string;
  createdAt: FieldValue | null;
  createdBy: UserType;
  comment: string;
  status: PhotoStatusEnum;
  likes: string[];
}

const storage: FirebaseStorage = getStorage();

const usePhoto = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [photoComment, setPhotoComment] = useState<string>("");
  const [photoId, setPhotoId] = useState<string>(uuid());

  const createPhotoMetadata = async (user: UserType) => {
    const db = getFirestore();
    const photoUser: UserType = { id: user.id, name: user.name, email: user.name, photoURL: user.photoURL };
    const photoMetadata: PhotoType = {
      id: photoId,
      createdAt: serverTimestamp(),
      createdBy: photoUser,
      comment: photoComment,
      status: PhotoStatusEnum.PENDING,
      likes: [],
    };
    setDoc(doc(db, "posts", photoId), photoMetadata).catch((e) => console.error(e));
  };

  const uploadPhoto = async (file: RcFile | string | Blob) => {
    const storageRef = ref(storage, `photos/${photoId}`);
    setIsUploading(true);
    await uploadBytesResumable(storageRef, file as Blob)
      .then(() => {
        message.success("Photo uploaded!");
        setPhotoComment("");
      })
      .catch((error) => {
        console.error(error);
        message.error("Error uploading photo.  Please contact an administrator.");
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const resetPhotoId = () => {
    setPhotoId(uuid());
  };

  return { photoComment, setPhotoComment, uploadPhoto, isUploading, createPhotoMetadata, resetPhotoId };
};

export default usePhoto;
export type { PhotoType, PhotoStatusEnum };