import React, { useEffect } from "react";
import type { FC } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spin } from "antd";
import usePhoto from "src/hooks/Photo";
import Photo from "src/components/PhotoFeed/Photo";

const FEED_IMAGE_WIDTH = 300;
const PHOTO_BASE_PATH = "photos/";

const PhotoFeed: FC = () => {
  const { getPhotos, photos, isPhotoLoading } = usePhoto();

  useEffect(() => {
    getPhotos();
  }, [getPhotos]);

  return (
    <div className="photo-feed">
      {isPhotoLoading && <Spin />}
      {!isPhotoLoading && photos.length === 0 && <h1>No photos found.</h1>}
      {!isPhotoLoading && photos.length > 0 && (
        <InfiniteScroll dataLength={photos.length} next={() => {}} hasMore loader={<Spin />}>
          {photos.map((p) => (
            <div className="item" key={p.id}>
              <Photo photo={p} width={FEED_IMAGE_WIDTH} path={PHOTO_BASE_PATH} />
              {p.id}
            </div>
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default PhotoFeed;
