import React, { useEffect } from 'react';
import "./ThumbSlider.css";
// import CustomSlider from "./ThumbSlider.js";
import Slider from "react-slick";
import Box from '@mui/material/Box';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

  const baseURL = process.env.REACT_APP_URL;
  const deviceWidth = document.documentElement.clientWidth || window.innerWidth || window.screen.width

const ThumbSLider = (image) => {
  const fotos = image.image;
  const home = image?.home;
  const detail = image?.detail;
  const settings = {
    lazyLoad: true,
    dots: true,
    className: "center",
    infinite: true,
    centerPadding: "60px",
    slidesToShow: image?.detail === 'true' && deviceWidth > 1024 ? 3 : 1,
    arrows: true,
    speed: 500
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