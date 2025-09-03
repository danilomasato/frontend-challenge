import React, { useEffect  } from 'react';
import "./ThumbSlider.css";
import CustomSlider from "./ThumbSlider.js";

const baseURL = process.env.REACT_APP_URL;


const ThumbSLider = (props) => {

  return (
    <>
        <CustomSlider>
        {props.image.map((image, index) => {
          return <img key={index} src={`${baseURL}${image.url}`} style={{ width: "100%", height: "140px" }} alt={image.imgAlt} />;
        })}
      </CustomSlider>    
    </>
  );
}

export default ThumbSLider;