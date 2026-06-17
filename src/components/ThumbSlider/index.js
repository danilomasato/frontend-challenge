import React, { useState, useEffect } from 'react';
import "./ThumbSlider.css";
// import CustomSlider from "./ThumbSlider.js";
import Slider from "react-slick";
import Box from '@mui/material/Box';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

const baseURL = process.env.REACT_APP_URL;
const deviceWidth = document.documentElement.clientWidth || window.innerWidth || window.screen.width

const ThumbSLider = (image) => {
  const fotos = image.image;
  const home = image?.home;
  const detail = image?.detail;
  const [nextSlideIndex, setNextSlideIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);
  const totalSlides = fotos?.length || []; // Total number of photos

  const settings = {
    lazyLoad: true,
    dots: true,
    className: "center",
    infinite: true,
    slidesToShow: image?.detail === 'true' && deviceWidth > 1024 ? 3 : 1,
    arrows: true,
    speed: 500,
    // current is the active slide, next is the one coming up
    beforeChange: (current, next) => {
      
      setCurrentSlideIndex(currentSlideIndex + 1);

      if(totalSlides === currentSlideIndex){
        setCurrentSlideIndex(1)
      }
      setNextSlideIndex(next);
    },
    afterChange: (current, next) => {
      // If you only care about updating *after* the animation finishes
      // console.log(`Now viewing slide: ${current}`);
    }
  }

  return (
    <>
        {fotos?.length > 0 ? (
          <>
          <Slider {...settings} className="container__slider">
            {fotos.map((image, index) => { 
              return <img key={index} src={ home === 'true' ? image.formats?.small.url : (deviceWidth >= 1024 && detail == 'true' ? image.formats?.medium.url : (Object.hasOwn(image.formats, 'large') ? image.formats.large?.url : image.formats.medium.url) ) } style={{ width: "100%", objectFit: 'cover' }} alt={image.imgAlt} />;
            })}
          </Slider>
          {/* Photo Counter Display */}
          <span className='countSlides'>
            <PhotoLibraryIcon /> {currentSlideIndex} / {totalSlides}
          </span>
          {/* <p>próxima foto: {nextSlideIndex}</p> */}
          </>
        )
      : ( 
      <>
        <Box className="wrap-load">
          <div className="loader"></div>
        </Box>
      </>
      )
      }
    </>
  );
}

export default ThumbSLider;