import React, { useEffect, useState } from "react";
import type { FC } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spin, Button } from "antd";
import { NotificationOutlined } from "@ant-design/icons";
import { DocumentData } from "firebase/firestore";
import usePhoto from "src/hooks/Photo";
import Photo from "src/components/PhotoFeed/Photo";

import "src/components/PhotoFeed/index.scss";

const PHOTO_BASE_PATH = "photos/resized/450/";
const PHOTO_POSTFIX = "_450x450";
const SCROLL_DATA_LENGTH = 3;

const PhotoFeed: FC = () => {
  const { getPhotos, photos, isPhotoLoading, toggleLike, haveNewPhotos } = usePhoto();
  const [photosLoaded, setPhotosLoaded] = useState<DocumentData[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const handleLikeAction = (photo: DocumentData, userId: string) => toggleLike(photo, userId);

  const fetchMorePhotos = () => {
    const newPhotos = photosLoaded.concat(photos.slice(photosLoaded.length, photosLoaded.length + SCROLL_DATA_LENGTH));
    setHasMore(photos.length > newPhotos.length);
    setPhotosLoaded(newPhotos);
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
        <>
          {haveNewPhotos && (
            <div className="new-photos-action">
              <Button onClick={getPhotos} icon={<NotificationOutlined />}>
                New Photos!
              </Button>
            </div>
          )}
          <div className="new-photos-action">
            <Button onClick={getPhotos} icon={<NotificationOutlined />}>
              New Photos!
            </Button>
          </div>
          <div className="feed-container">
            <InfiniteScroll
              dataLength={SCROLL_DATA_LENGTH}
              next={fetchMorePhotos}
              hasMore={hasMore}
              loader={
                <div className="feed-loader">
                  <Button onClick={fetchMorePhotos}>Load More ...</Button>
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
          </div>
        </>
      )}
    </div>
  );
};

export default PhotoFeed;
