import React from "react";
import type { FC } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spin } from "antd";

const PhotoFeed: FC = () => {
  const photos = [
    {
      id: 1,
      photoUrl: "https://picsum.photos/500",
    },
    {
      id: 2,
      photoUrl: "https://picsum.photos/500",
    },
    {
      id: 3,
      photoUrl: "https://picsum.photos/500",
    },
  ];

  const renderPhotos: () => JSX.Element[] = () =>
    photos.map((photo) => (
      <div className="item" key={photo.id}>
        <img src={photo.photoUrl} alt={`Feed ${photo.id}`} />
      </div>
    ));

  return (
    <div className="photo-feed">
      <InfiniteScroll dataLength={photos.length} next={() => {}} hasMore loader={<Spin />}>
        {renderPhotos()}
      </InfiniteScroll>
    </div>
  );
};

export default PhotoFeed;
