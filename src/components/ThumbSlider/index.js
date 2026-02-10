import React, { useEffect  } from 'react';
import "./ThumbSlider.css";
// import CustomSlider from "./ThumbSlider.js";
import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
const baseURL = process.env.REACT_APP_URL;

  const ThumbSLider = (image) => {
  const fotos = image.image;

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <>
        {fotos?.length > 0 ? (
          <>
          <Slider {...settings} className="container__slider">
            {fotos.map((image, index) => {
              return <img key={index} src={ image.home === "true" ? image.formats.small.url : (image.width > 1980 ? image.formats.large.url : image.url ) } style={{ width: "100%", height: image.height + '400px', objectFit: 'cover' }} alt={image.imgAlt} />;
            })}
          </Slider>
          </>
        )
      : ( 
      <>
        <img src={`https://www2.camara.leg.br/atividade-legislativa/comissoes/comissoes-permanentes/cindra/imagens/sem.jpg.gif/image`} style={{ width: "100%", height:'200px', objectFit: 'contain' }} alt='sem imagem' />
      </>
      )
      }
    </>
  );
}

export default ThumbSLider;