import React, { useEffect } from 'react';
import "./ThumbSlider.css";
// import CustomSlider from "./ThumbSlider.js";
import Slider from "react-slick";
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
              return <h3><img key={index} src={ home === 'true' ? image.formats.small.url : (deviceWidth >= 1024 && detail == 'true' ? image.formats.medium.url : (Object.hasOwn(image.formats, 'large') ? image.formats.large?.url : image.formats.medium.url) ) } style={{ width: "100%", objectFit: 'cover' }} alt={image.imgAlt} /></h3>;
            })}
          </Slider>
          </>
        )
      : ( 
      <>
        <img src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8lRbS7eKYzDq-Ftxc1p8G_TTw2unWBMEYUw&s`} style={{ width: "100%", height:'200px', objectFit: 'none' }} alt='sem imagem' />
      </>
      )
      }
    </>
  );
}

export default ThumbSLider;