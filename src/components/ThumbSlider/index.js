import React, { useState } from 'react';
import './ThumbSlider.css';
import Slider from 'react-slick';
import Box from '@mui/material/Box';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
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
  const [imageSourceIndexes, setImageSourceIndexes] = useState({});

  const totalSlides = Array.isArray(fotos) ? fotos.length : 0;

  const getImageSources = (image) => {
    if (!image) return [];

    const formats = image.formats || {};

    const sources =
      home === 'true'
        ? [
            formats.small?.url,
            formats.medium?.url,
            formats.large?.url,
            image.url,
          ]
        : deviceWidth > 1024 && detail === 'true'
          ? [
              formats.medium?.url,
              formats.large?.url,
              formats.small?.url,
              image.url,
            ]
          : [
              formats.large?.url,
              formats.medium?.url,
              formats.small?.url,
              image.url,
            ];

    return [...new Set(sources.filter(Boolean))];
  };

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  const handleImageError = (index, sources) => {
    const nextSourceIndex = (imageSourceIndexes[index] || 0) + 1;

    if (nextSourceIndex < sources.length) {
      setImageSourceIndexes((prev) => ({
        ...prev,
        [index]: nextSourceIndex,
      }));
    }
  };

  const settings = {
    dots: true,
    className: 'center',
    infinite: totalSlides > 1,
    slidesToShow:
      detail === 'true' && deviceWidth > 1024 ? 3 : 1,
    slidesToScroll: 1,
    arrows: true,
    speed: 500,
    initialSlide: 0,
    lazyLoad: false,
    swipe: !isMobile,
    touchMove: !isMobile,
    draggable: !isMobile,

    beforeChange: (_, next) => {
      setCurrentSlideIndex(
        totalSlides > 0 ? (next % totalSlides) + 1 : 1
      );
    },
  };

  return (
    <>
      {totalSlides > 0 ? (
        <>
          <Slider {...settings} className="container__slider">
            {fotos.map((image, index) => {
              const sources = getImageSources(image);
              const sourceIndex = imageSourceIndexes[index] || 0;
              const imageSrc = sources[sourceIndex];

              return (
                <div key={image?.id ?? image?.documentId ?? index}>
                  <div className="slide-image-wrapper">
                    {!loadedImages[index] && (
                      <div className="image-skeleton" />
                    )}

                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={
                          image.imgAlt ||
                          image.alternativeText ||
                          image.name ||
                          ''
                        }
                        loading={index === 0 ? 'eager' : 'lazy'}
                        fetchPriority={index === 0 ? 'high' : 'auto'}
                        onLoad={() => {
                          handleImageLoad(index);
                        }}
                        onError={() => {
                          handleImageError(index, sources);
                        }}
                        className={`slider-image ${
                          loadedImages[index] ? 'loaded' : ''
                        }`}
                      />
                    ) : (
                      <div className="image-skeleton" />
                    )}
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
          <div className="loader" />
        </Box>
      )}
    </>
  );
};

export default ThumbSLider;