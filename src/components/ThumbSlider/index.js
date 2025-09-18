import React, { useEffect  } from 'react';
import "./ThumbSlider.css";
import CustomSlider from "./ThumbSlider.js";

const baseURL = process.env.REACT_APP_URL;


const ThumbSLider = (props) => {
console.log('prThumbSLiderops', props)
  return (
    <>
        <CustomSlider>
        {props.image.map((image, index) => {
          return <img key={index} src={`${baseURL}${image.url}`} style={{ width: "100%", height: props.height + 'px', objectFit: 'cover' }} alt={image.imgAlt} />;
        })}
      </CustomSlider>    
    </>
  );
}

export default ThumbSLider;