import React, { useEffect, useContext } from "react";
import type { FC } from "react";
import AuthContext from "src/store/auth-context";
import Photo from "src/components/PhotoFeed/Photo";
import usePhoto from "src/hooks/Photo";

import "./index.scss";

const PHOTO_BASE_PATH = "photos/resized/450/";
const PHOTO_POSTFIX = "_450x450";
const PHOTO_DISPLAY_INTERVAL = 12000;

const SlideShow: FC = () => {
  useContext(AuthContext);
  const { getRealTimePhotos, photos, photo, setPhoto, showPhoto, setShowPhoto, newPhoto, setNewPhoto } = usePhoto();

  useEffect(() => {
    getRealTimePhotos();
  }, [getRealTimePhotos]);

  useEffect(() => {
    if (photos.length > 0) {
      const interval = setInterval(() => {
        const currentIndex = Math.floor(Math.random() * photos.length);
        setShowPhoto(false);

        if (newPhoto) {
          setPhoto(newPhoto);
          setNewPhoto(null);
        } else {
          setPhoto(photos[currentIndex]);
        }
      }, PHOTO_DISPLAY_INTERVAL);
      return () => {
        clearInterval(interval);
        setTimeout(() => {
          setShowPhoto(true);
        }, 3000);
      };
    }

    return () => {};
  }, [newPhoto, setNewPhoto, setPhoto, showPhoto, setShowPhoto, photos]);

  return (
    <div className="slide-show">
      <div className={`${showPhoto ? "show" : ""} item`}>
        {photos.length > 0 && !!photo && (
          <div className="photo-container">
            <Photo photo={photo} path={PHOTO_BASE_PATH} postfix={PHOTO_POSTFIX} userView={false} slideShowView />
          </div>
        )}
      </div>
    </div>
  );
};
export default SlideShow;
