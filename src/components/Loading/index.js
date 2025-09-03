import React from "react";
import "./Loading.css";

export const Loading = data => {
  
  return (
    <>
      <div className="overlay">
        <img src="https://cdn.pixabay.com/animation/2023/05/02/04/29/04-29-06-428_512.gif" className="overlay-img" />
      </div>
    </>
  );
};

export default Loading;
