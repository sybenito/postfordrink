import { useState, useCallback, useEffect } from "react";
import type { RcFile } from "rc-upload/lib/interface";
import { v4 as uuid } from "uuid";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  serverTimestamp,
  FieldValue,
  query,
  collection,
  updateDoc,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { message } from "antd";
import type { DocumentData } from "firebase/firestore";
import type { UserType } from "src/models/user";

enum PhotoStatusEnum {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  DELETED = "deleted",
}

type PhotoUserType = Omit<UserType, "type" | "tickets">;

interface PhotoType {
  id: string;
  createdAt: FieldValue | null;
  createdBy: PhotoUserType;
  comment: string;
  status: PhotoStatusEnum;
  likes: string[];
}

const storage: FirebaseStorage = getStorage();

const usePhoto = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isPhotoLoading, setIsPhotoLoading] = useState<boolean>(false);
  const [photoComment, setPhotoComment] = useState<string>("");
  const [photoId, setPhotoId] = useState<string>(uuid());
  const [photos, setPhotos] = useState<DocumentData[]>([]);
  const [haveNewPhotos, setHaveNewPhotos] = useState<boolean>(false);
  const db = getFirestore();

  const getPhotos = useCallback(async () => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    setIsPhotoLoading(true);

    getDocs(q)
      .then((querySnapshot) => {
        setPhotos(querySnapshot.docs);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsPhotoLoading(false);
        setHaveNewPhotos(false);
      });
  }, [db]);

  const createPhotoMetadata = useCallback(
    async (user: UserType) => {
      const photoUser: PhotoUserType = {
        id: user.id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
      };
      const photoMetadata: PhotoType = {
        id: photoId,
        createdAt: serverTimestamp(),
        createdBy: photoUser,
        comment: photoComment,
        status: PhotoStatusEnum.PENDING,
        likes: [],
      };
      setDoc(doc(db, "posts", photoId), photoMetadata).catch((e) => console.error(e));
    },
    [photoId, photoComment, db]
  );

  const uploadPhoto = useCallback(
    async (file: RcFile | string | Blob) => {
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
    },
    [photoId]
  );

  const toggleLike = useCallback(
    async (photo: DocumentData, userId: string) => {
      const photoRef = doc(db, "posts", photo.id);
      const photoData: PhotoType = photo.data();
      const { likes } = photoData;
      const likeIndex = likes.indexOf(userId);

      if (likeIndex === -1) {
        likes.push(userId);
      } else {
        likes.splice(likeIndex, 1);
      }

      return updateDoc(photoRef, { likes })
        .then(() => likes)
        .catch((e) => console.error(e));
    },
    [db]
  );

  const resetPhotoId = () => {
    setPhotoId(uuid());
  };

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.docs.length > photos.length && photos.length > 0) setHaveNewPhotos(true);
    });
  }, [photos, db]);

  return {
    photoComment,
    setPhotoComment,
    uploadPhoto,
    isUploading,
    createPhotoMetadata,
    resetPhotoId,
    getPhotos,
    toggleLike,
    haveNewPhotos,
    photos,
    isPhotoLoading,
  };
};

export default usePhoto;
export type { PhotoType, PhotoStatusEnum };
