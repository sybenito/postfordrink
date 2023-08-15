import React, { useEffect } from "react";
import type { FC } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spin } from "antd";
import usePhoto from "src/hooks/Photo";

const PHOTO_BASE_URL = "https://firebasestorage.googleapis.com/v0/b/postfordrink.appspot.com/o/photos/";

const PhotoFeed: FC = () => {
  const { getPhotos, photos, isPhotoLoading } = usePhoto();

  const renderPhotos = () =>
    photos.map((photo) => (
      <div className="item" key={photo.id}>
        <img src={PHOTO_BASE_URL + photo.id} alt={`${photo.comment}`} />
      </div>
    ));

  useEffect(() => {
    getPhotos();
  }, [getPhotos]);

  return (
    <div className="photo-feed">
      {isPhotoLoading && <Spin />}
      {!isPhotoLoading && photos.length === 0 && <h1>No photos found.</h1>}
      {!isPhotoLoading && photos.length > 0 && (
        <InfiniteScroll dataLength={photos.length} next={() => {}} hasMore loader={<Spin />}>
          {renderPhotos()}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default PhotoFeed;
