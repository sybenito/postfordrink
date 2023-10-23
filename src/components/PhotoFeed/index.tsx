import React, { useEffect, useState } from "react";
import type { FC } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spin } from "antd";
import { DocumentData } from "firebase/firestore";
import usePhoto from "src/hooks/Photo";
import Photo from "src/components/PhotoFeed/Photo";

import "src/components/PhotoFeed/index.scss";

const PHOTO_BASE_PATH = "photos/resized/450/";
const PHOTO_POSTFIX = "_450x450";
const SCROLL_DATA_LENGTH = 3;

const PhotoFeed: FC = () => {
  const { getPhotos, photos, isPhotoLoading, toggleLike } = usePhoto();
  const [photosLoaded, setPhotosLoaded] = useState<DocumentData[]>([]);

  const handleLikeAction = (photo: DocumentData, userId: string) => toggleLike(photo, userId);

  const handleGetMorePhotos = () => {
    setPhotosLoaded([...photosLoaded, ...photos.slice(photosLoaded.length, photosLoaded.length + SCROLL_DATA_LENGTH)]);
  };

  useEffect(() => {
    getPhotos();
  }, [getPhotos]);

  useEffect(() => {
    if (photos.length > 0 && photosLoaded.length === 0) {
      setPhotosLoaded(photos.slice(photosLoaded.length, photosLoaded.length + SCROLL_DATA_LENGTH));
    }
  }, [photos, photosLoaded]);

  return (
    <div className="photo-feed">
      {isPhotoLoading && <Spin />}
      {!isPhotoLoading && photosLoaded.length === 0 && <h1>No photos found.</h1>}
      {!isPhotoLoading && photosLoaded.length > 0 && (
        <InfiniteScroll
          dataLength={SCROLL_DATA_LENGTH}
          next={handleGetMorePhotos}
          hasMore={photosLoaded.length < photos.length}
          loader={
            <div className="feed-loader">
              <Spin />
            </div>
          }
          endMessage={<p className="feed-end">Thats it! Thats all.</p>}
        >
          {photosLoaded.map((p) => (
            <div className="item" key={p.id}>
              <Photo photo={p} path={PHOTO_BASE_PATH} postfix={PHOTO_POSTFIX} likeAction={handleLikeAction} />
            </div>
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default PhotoFeed;
