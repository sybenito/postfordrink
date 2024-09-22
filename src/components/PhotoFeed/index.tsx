import React, { useEffect, useState } from "react";
import type { FC } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spin, Button, Empty } from "antd";
import { DocumentData } from "firebase/firestore";
import { UserType } from "src/models/user";
import usePhoto from "src/hooks/Photo";
import Photo from "src/components/PhotoFeed/Photo";

import "src/components/PhotoFeed/index.scss";

interface PhotoFeedProps {
  user?: UserType;
}

const PHOTO_BASE_PATH = "photos/resized/450/";
const PHOTO_POSTFIX = "_450x450";
const SCROLL_DATA_LENGTH = 20;

const PhotoFeed: FC<PhotoFeedProps> = ({ user }) => {
  const { getPhotos, photos, isPhotoLoading, toggleLike } = usePhoto();
  const [photosLoaded, setPhotosLoaded] = useState<DocumentData[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const handleLikeAction = (photo: DocumentData, userId: string) => toggleLike(photo, userId);

  const fetchMorePhotos = () => {
    const newPhotos = photosLoaded.concat(photos.slice(photosLoaded.length, photosLoaded.length + SCROLL_DATA_LENGTH));
    setHasMore(photos.length > newPhotos.length);
    setPhotosLoaded(newPhotos);
  };

  useEffect(() => {
    setTimeout(() => {
      const reloadPhotos = photos.slice(0, photosLoaded.length);
      setPhotosLoaded(reloadPhotos);
    }, 5000);
  }, [photos, photosLoaded]);

  useEffect(() => {
    getPhotos(user);
  }, [getPhotos, user]);

  useEffect(() => {
    if (photos.length > 0 && photosLoaded.length === 0) {
      setPhotosLoaded(photos.slice(photosLoaded.length, photosLoaded.length + SCROLL_DATA_LENGTH));
    }
  }, [photos, photosLoaded]);

  return (
    <div className="photo-feed">
      {isPhotoLoading && <Spin />}
      {!isPhotoLoading && photosLoaded.length === 0 && <Empty description={false} />}
      {!isPhotoLoading && photosLoaded.length > 0 && (
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
            endMessage={<h3 className="feed-end">Thats it! Thats all.</h3>}
          >
            {photosLoaded.map((p) => (
              <div className="item" key={p.id}>
                <Photo photo={p} path={PHOTO_BASE_PATH} postfix={PHOTO_POSTFIX} likeAction={handleLikeAction} />
              </div>
            ))}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};

export default PhotoFeed;
