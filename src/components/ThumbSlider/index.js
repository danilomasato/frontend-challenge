import React, { useEffect  } from 'react';
import "./ThumbSlider.css";
import CustomSlider from "./ThumbSlider.js";
const baseURL = process.env.REACT_APP_URL;

const ThumbSLider = (props) => {
  return (
    <>
        {props.image?.length > 0 ? (
          <CustomSlider>
            {props.image.map((image, index) => {
              return <img key={index} src={`${image.url}`} style={{ width: "100%", height: props.height + 'px', objectFit: 'cover' }} alt={image.imgAlt} />;
            })}
          </CustomSlider>  
        )
      : ( 
      <>
        <img src={`https://www2.camara.leg.br/atividade-legislativa/comissoes/comissoes-permanentes/cindra/imagens/sem.jpg.gif/image`} style={{ width: "100%", height: props.height + 'px', objectFit: 'contain' }} alt='sem imagem' />
      </>
      )
      }
    </>
  );
}

export default ThumbSLider;