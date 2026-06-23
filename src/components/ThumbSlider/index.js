import React, { useState } from 'react';
import "./ThumbSlider.css";
import Slider from "react-slick";
import Box from '@mui/material/Box';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

const deviceWidth =
  document.documentElement.clientWidth ||
  window.innerWidth ||
  window.screen.width;

const isMobile = deviceWidth <= 1024;

const ThumbSLider = (props) => {
  const fotos = props.image;
  const home = props?.home;
  const detail = props?.detail;

  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);
  const [loadedImages, setLoadedImages] = useState({});

  const totalSlides = fotos?.length || 0;

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({
      ...prev,
      [index]: true
    }));
  };

  const settings = {
    lazyLoad: true,
    dots: true,
    className: "center",
    infinite: true,
    slidesToShow:
      detail === "true" && deviceWidth > 1024 ? 3 : 1,
    arrows: true,
    speed: 500,

    // desabilita swipe no mobile
    swipe: !isMobile,
    draggable: !isMobile,
    touchMove: !isMobile,
    swipe: false,
    touchMove: false,
    draggable: false,

    beforeChange: (_, next) => {
      setCurrentSlideIndex(next + 1);
    }
  };

  return (
    <>
      {fotos?.length > 0 ? (
        <>
          <Slider {...settings} className="container__slider">
            {fotos.map((image, index) => {
              const imageSrc =
                home === "true"
                  ? image.formats?.small.url
                  : deviceWidth >= 1024 && detail === "true"
                  ? image.formats?.medium.url
                  : Object.hasOwn(image.formats, "large")
                  ? image.formats.large?.url
                  : image.formats.medium.url;

              return (
                <div key={index}>
                  <div className="slide-image-wrapper">
                    {!loadedImages[index] && (
                      <div className="image-skeleton" />
                    )}

                    <img
                      src={imageSrc}
                      alt={image.imgAlt || ""}
                      loading="lazy"
                      onLoad={() => handleImageLoad(index)}
                      className={`slider-image ${
                        loadedImages[index] ? "loaded" : ""
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </Slider>

          <span className="countSlides">
            <PhotoLibraryIcon />
            {currentSlideIndex} / {totalSlides}
          </span>
        </>
      ) : (
        <Box className="wrap-load">
          <div className="loader"></div>
        </Box>
      )}
    </>
  );
};

export default ThumbSLider;